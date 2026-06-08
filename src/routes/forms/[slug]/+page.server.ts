import { fail } from '@sveltejs/kit';
import type { Prisma } from '@prisma/client';
import { assertCsrf } from '$lib/auth/csrf';
import { prisma } from '$lib/db/prisma';
import { cleanText } from '$lib/server/sanitize';
import { saveUpload } from '$lib/storage';

export async function load({ params }) {
  const form = await prisma.citizenForm.findUnique({
    where: { slug: params.slug },
    include: { fields: { orderBy: { position: 'asc' } } }
  });
  return { form };
}

export const actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    assertCsrf(event, formData);
    const form = await prisma.citizenForm.findUnique({
      where: { slug: event.params.slug },
      include: { fields: true }
    });
    if (!form || !form.active) return fail(404, { message: 'forms.inactive' });
    const values: Record<string, Prisma.InputJsonValue | null> = {};
    for (const field of form.fields) {
      if (field.type === 'MULTIPLE_CHOICE') {
        values[field.id] = formData.getAll(field.id).map((value) => cleanText(value));
      } else if (field.type === 'ATTACHMENT') {
        const file = formData.get(field.id);
        values[field.id] =
          file instanceof File && file.size > 0
            ? await saveUpload(file)
            : null;
      } else {
        values[field.id] = cleanText(formData.get(field.id));
      }
      const current = values[field.id];
      if (field.required && (current === null || current === '' || (Array.isArray(current) && current.length === 0))) {
        return fail(400, { message: 'errors.missingField', params: { field: field.label } });
      }
    }
    await prisma.formResponse.create({ data: { formId: form.id, values: values as Prisma.InputJsonObject } });
    return { message: 'forms.success' };
  }
};
