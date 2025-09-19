'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../shared/components/table';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '../../shared/components/multi-select';
import { getRoles, getUsers, updateUserRoles } from '../../api/services/user.service';
import { UserDto, UserRole } from '../../api/types/user.types';
import { QUERY_KEYS } from '../../api/const/query-keys.const';
import { capitalize } from '../../shared/utils/capitalize';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';

const RolesCell = ({
  userId,
  roles,
  allRoles,
}: {
  userId: string;
  roles: UserRole[];
  allRoles: UserRole[];
}) => {
  const queryClient = useQueryClient();
  const [local, setLocal] = useState<string[]>(roles);

  useEffect(() => {
    setLocal(roles);
  }, [roles]);

  const mutation = useMutation({
    mutationFn: (nextRoles: UserRole[]) => updateUserRoles(userId, nextRoles),
    onMutate: async (nextRoles) => {
    // Added optimistic update for seamless UI
      setLocal(nextRoles);
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.USERS] });
      const previousUsers = queryClient.getQueryData<UserDto[]>([
        QUERY_KEYS.USERS,
      ]);
      if (previousUsers) {
        queryClient.setQueryData<UserDto[]>([QUERY_KEYS.USERS], (old) =>
          (old ?? []).map((u) =>
            u.id === userId ? { ...u, roles: nextRoles } : u
          )
        );
      }
      return { previousUsers };
    },
    onError: (err, _vars, ctx) => {
      const message = (err as any)?.response?.data?.message || (err as any)?.message || 'Please try again.';
      toast.error('Failed to update roles', {
        description: Array.isArray(message) ? message.join(', ') : message,
      });
      if (ctx?.previousUsers) {
        queryClient.setQueryData([QUERY_KEYS.USERS], ctx.previousUsers);
        const prev =
          ctx.previousUsers.find((u) => u.id === userId)?.roles ?? roles;
        setLocal(prev);
      }
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<UserDto[]>([QUERY_KEYS.USERS], (old) => {
        return (old ?? []).map((u) => (u.id === updatedUser.id ? updatedUser : u));
      });
    },
  });

  return (
    <MultiSelect
      values={local}
      onValuesChange={(vals) => mutation.mutate(vals as UserRole[])}
    >
      <MultiSelectTrigger
        isLoading={mutation.isPending}
        disabled={mutation.isPending}
        className="min-w-[220px]"
      >
        <MultiSelectValue placeholder="Select roles..." />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        {allRoles.map((r) => (
          <MultiSelectItem key={r} value={r}>
            {capitalize(r)}
          </MultiSelectItem>
        ))}
      </MultiSelectContent>
    </MultiSelect>
  );
};

export const UsersTable = () => {
  const usersQuery = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await getUsers();
      } catch (err) {
        toast.error('Failed to load users', {
          description: (err as any)?.message ?? 'Please try again later.',
        });
        throw err;
      }
    },
  });
  const rolesQuery = useQuery({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await getRoles();
      } catch (err) {
        toast.error('Failed to load roles', {
          description: (err as any)?.message ?? 'Please try again later.',
        });
        throw err;
      }
    },
  });

  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const filteredData = useMemo(() => {
    const data = usersQuery.data ?? [];
    if (roleFilter.length === 0) return data;
    const set = new Set(roleFilter);
    return data.filter((u) => u.roles.some((r) => set.has(r)));
  }, [usersQuery.data, roleFilter]);

  const columns = useMemo<ColumnDef<UserDto>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className="text-foreground">{row.getValue('name')}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.getValue('email')}</span>
        ),
      },
      {
        id: 'roles',
        header: 'Roles',
        cell: ({ row }) => (
          <RolesCell
            userId={row.original.id}
            roles={row.original.roles}
            allRoles={rolesQuery.data ?? []}
          />
        ),
      },
    ],
    [rolesQuery.data]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (usersQuery.isLoading || rolesQuery.isLoading) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        Loading data...
      </div>
    );
  }

  if (usersQuery.isError) {
    return <div className="text-sm text-destructive">Failed to load users</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MultiSelect values={roleFilter} onValuesChange={setRoleFilter}>
            <MultiSelectTrigger className="min-w-[220px]">
              <MultiSelectValue placeholder="Filter by role" />
            </MultiSelectTrigger>
            <MultiSelectContent search={false}>
              {(rolesQuery.data ?? []).map((r) => (
                <MultiSelectItem key={r} value={r}>
                  {capitalize(r)}
                </MultiSelectItem>
              ))}
            </MultiSelectContent>
          </MultiSelect>
        </div>
      </div>

      <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      </Table>
    </div>
  );
};
