import { UsersTable } from './users-table';

const UsersManagementPage = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 px-4 py-12">
        <header className="w-full text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Users management
          </h1>
        </header>
        <section className="w-full rounded-lg border bg-card p-4 shadow-sm">
          <UsersTable />
        </section>
      </div>
    </div>
  );
};

export default UsersManagementPage;
