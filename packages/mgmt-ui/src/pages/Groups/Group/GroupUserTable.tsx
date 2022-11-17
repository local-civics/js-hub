import {openConfirmModal}                                                   from "@mantine/modals";
import * as React                                                           from 'react';
import { Avatar, Table, Group, Text, ActionIcon, UnstyledButton, ScrollArea, Select } from '@mantine/core';
import {IconTrash}                                                                           from '@tabler/icons';
import {relativeTimeFromDates}                                              from "../../../utils/time";

const rolesData = ['Member', 'Admin'];

/**
 * GroupUserItem
 */
export type GroupUserItem = {
    key: string
    avatar: string,
    email: string,
    givenName: string,
    familyName: string,
    role: string,
    lastActivity: Date | null
}

/**
 * GroupUserTableProps
 */
export interface GroupUserTableProps {
    data: GroupUserItem[];

    onChangeRole: (user: GroupUserItem, role: string | null) => void;
    onDelete: (user: GroupUserItem) => void
    onViewProfile: (user: GroupUserItem) => void
}

/**
 * GroupUserTable
 * @param props
 * @constructor
 */
export function GroupUserTable(props: GroupUserTableProps) {
    const openDeleteModal = (user: GroupUserItem) => openConfirmModal({
        title: `Delete "${user.givenName && user.familyName ? `${user.givenName} ${user.familyName}` : user.email}"?`,
        centered: true,
        children: (
            <Text size="sm">
                Are you sure you want to delete this person? This action is destructive and you will have
                to contact support to restore your data.
            </Text>
        ),
        labels: { confirm: 'Delete', cancel: "No don't delete them" },
        confirmProps: { color: 'red' },
        onConfirm: () => props.onDelete && props.onDelete(user),
    });

    const rows = props.data.map((row) => (
        <tr key={row.email}>
            <td>
                <UnstyledButton
                    onClick={() => props.onViewProfile && props.onViewProfile(row)}>
                    <Group spacing="sm">
                        <Avatar size={40} src={row.avatar} radius={40} />
                        <div>
                            <Text size="sm" weight={500}>
                                {row.givenName && row.familyName ? `${row.givenName} ${row.familyName}` : row.email}
                            </Text>
                            <Text size="xs" color="dimmed">
                                {row.email}
                            </Text>
                        </div>
                    </Group>
                </UnstyledButton>
            </td>
            <td>
                <Select
                    data={rolesData}
                    defaultValue={row.role}
                    variant="unstyled"
                    onChange={v => props.onChangeRole && props.onChangeRole(row, v)}
                />
            </td>
            <td>{row.lastActivity ? relativeTimeFromDates(row.lastActivity) : ""}</td>
            <td>
                <Group noWrap spacing={0} position="right">
                    <ActionIcon color="red">
                        <IconTrash onClick={() => openDeleteModal(row)} size={16} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </td>
        </tr>
    ));

    return (
        <ScrollArea>
            <Table verticalSpacing={20} sx={{ minWidth: 700 }}>
                <thead>
                    <tr>
                        <th>Member</th>
                        <th>Role</th>
                        <th>Last active</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}