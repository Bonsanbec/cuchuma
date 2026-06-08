<script lang="ts">
  let { data, form } = $props();
</script>

<section class="section">
  <h1>Usuarios y roles</h1>
  {#if form?.message}<p class="notice">{form.message}</p>{/if}
  <form class="form-stack card" method="POST" action="?/create">
    <input type="hidden" name="csrf" value={data.csrf} />
    <div class="two-col">
      <label>Nombre <input name="name" required /></label>
      <label>Correo <input type="email" name="email" required /></label>
      <label>Contraseña inicial <input type="password" name="password" minlength="12" required /></label>
      <label>Rol
        <select name="roleId" required>{#each data.roles as role}<option value={role.id}>{role.name}</option>{/each}</select>
      </label>
    </div>
    <button type="submit">Crear usuario</button>
  </form>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Acción</th></tr></thead>
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
                <label><span><input type="checkbox" name="suspended" checked={user.suspended} /> Suspendido</span></label>
                <button type="submit">Guardar</button>
              </form>
            </td>
            <td>{user.suspended ? 'Suspendido' : 'Activo'}</td>
            <td class="meta">{new Date(user.createdAt).toLocaleDateString('es-MX')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
