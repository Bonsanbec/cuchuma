<script lang="ts">
  import { t } from '$lib/i18n';
  let { data, form } = $props();
  let activeTab = $state('users');
</script>

<section class="section">
  <h1>{$t('admin.users.title')}</h1>

  {#if form?.message}
    <p class="notice" class:error={form.message.startsWith('errors.') || form.message.startsWith('validation.')}>
      {form.message.startsWith('errors.') || form.message.startsWith('notifications.') || form.message.startsWith('admin.') || form.message.startsWith('auth.')
        ? $t(form.message, (form as any)?.params)
        : form.message}
    </p>
  {/if}

  <div class="actions" style="margin-bottom: 1.5rem; display: flex; gap: 1rem;">
    <button class={activeTab === 'users' ? '' : 'secondary'} onclick={() => activeTab = 'users'}>
      {$t('admin.users.usersTab')}
    </button>
    <button class={activeTab === 'requests' ? '' : 'secondary'} onclick={() => activeTab = 'requests'}>
      {$t('admin.users.requestsTab', { count: data.requests.length })}
    </button>
  </div>

  {#if activeTab === 'users'}
    <form class="form-stack card" method="POST" action="?/create">
      <input type="hidden" name="csrf" value={data.csrf} />
      <div class="two-col">
        <label>{$t('admin.users.name')} <input name="name" required /></label>
        <label>{$t('admin.users.emailShort')} <input type="email" name="email" required /></label>
        <label>{$t('admin.users.initialPassword')} <input type="password" name="password" minlength="12" required /></label>
        <label>{$t('admin.users.role')}
          <select name="roleId" required>
            {#each data.roles as role}
              <option value={role.id}>{role.name}</option>
            {/each}
          </select>
        </label>
      </div>
      <button type="submit">{$t('admin.users.create')}</button>
    </form>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{$t('admin.users.userColumn')}</th>
            <th>{$t('admin.users.role')}</th>
            <th>{$t('admin.users.status')}</th>
            <th>{$t('admin.users.actionColumn')}</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user}
            <tr>
              <td>{user.name}<br /><span class="meta">{user.email}</span></td>
              <td>
                <form method="POST" action="?/update" class="form-stack">
                  <input type="hidden" name="csrf" value={data.csrf} />
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="name" value={user.name} />
                  <select name="roleId">
                    {#each data.roles as role}
                      <option value={role.id} selected={role.id === user.roleId}>{role.name}</option>
                    {/each}
                  </select>
                  <label>
                    <span>
                      <input type="checkbox" name="suspended" checked={user.suspended} />
                      {$t('admin.users.suspended')}
                    </span>
                  </label>
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
  {:else}
    <!-- Access Requests -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{$t('admin.users.userColumn')}</th>
            <th>{$t('admin.users.motivation')}</th>
            <th>{$t('admin.users.actionColumn')}</th>
          </tr>
        </thead>
        <tbody>
          {#each data.requests as request}
            <tr>
              <td>
                <strong>{request.name}</strong><br />
                <span class="meta">{request.email}</span><br />
                <span class="meta">{new Date(request.createdAt).toLocaleString('es-MX')}</span>
              </td>
              <td>
                <p style="white-space: pre-wrap; margin: 0;">{request.motivation}</p>
              </td>
              <td>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; align-items: start;">
                  <form method="POST" action="?/approveRequest" style="width: 100%;">
                    <input type="hidden" name="csrf" value={data.csrf} />
                    <input type="hidden" name="requestId" value={request.id} />
                    <label style="margin-bottom: 0.25rem; font-weight: normal;">
                      {$t('admin.users.role')}
                      <select name="roleId" required style="padding: 0.4rem;">
                        {#each data.roles as role}
                          <option value={role.id} selected={role.level === 'CONTRIBUTOR'}>{role.name}</option>
                        {/each}
                      </select>
                    </label>
                    <button type="submit" style="padding: 0.4rem 0.8rem; min-height: auto;">
                      {$t('admin.users.approve')}
                    </button>
                  </form>
                  <form method="POST" action="?/rejectRequest" style="width: 100%;">
                    <input type="hidden" name="csrf" value={data.csrf} />
                    <input type="hidden" name="requestId" value={request.id} />
                    <button type="submit" class="danger" style="padding: 0.4rem 0.8rem; min-height: auto;">
                      {$t('admin.users.reject')}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="3" class="meta">{$t('admin.content.noContent')}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

