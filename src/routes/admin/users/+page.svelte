<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
</script>

<section class="section">
  <h1>{$t('admin.users.title')}</h1>
  {#if form?.message}<p class="notice">{form.message.startsWith('errors.') || form.message.startsWith('notifications.') ? $t(form.message) : form.message}</p>{/if}
  <form class="form-stack card" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <div class="two-col">
      <label>{$t('admin.users.name')} <input name="name" required /></label>
      <label>{$t('admin.users.emailShort')} <input type="email" name="email" required /></label>
      <label>{$t('admin.users.initialPassword')} <input type="password" name="password" minlength="12" required /></label>
      <label>{$t('admin.users.role')}
        <select name="roleId" required>{#each data.roles as role}<option value={role.id}>{role.name}</option>{/each}</select>
      </label>
    </div>
    <button type="submit">{$t('admin.users.create')}</button>
  </form>
  <div class="table-wrap">
    <table>
      <thead><tr><th>{$t('admin.users.userColumn')}</th><th>{$t('admin.users.role')}</th><th>{$t('admin.users.status')}</th><th>{$t('admin.users.actionColumn')}</th></tr></thead>
      <tbody>
        {#each data.users as user}
          <tr>
            <td>{user.name}<br /><span class="meta">{user.email}</span></td>
            <td>
              <form method="POST" action="?/update" class="form-stack">
                <input type="hidden" name="csrf" value={data.csrf} />
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="name" value={user.name} />
                <select name="roleId">{#each data.roles as role}<option value={role.id} selected={role.id === user.roleId}>{role.name}</option>{/each}</select>
                <label><span><input type="checkbox" name="suspended" checked={user.suspended} /> {$t('admin.users.suspended')}</span></label>
                <button type="submit">{$t('admin.settings.save')}</button>
              </form>
            </td>
            <td>{user.suspended ? $t('admin.users.suspended') : $t('admin.users.active')}</td>
            <td class="meta">{new Date(user.createdAt).toLocaleDateString('es-MX')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

