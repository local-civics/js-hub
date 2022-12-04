import * as React                                         from 'react';
import { Table, Group, Text, ScrollArea, UnstyledButton } from '@mantine/core';
import {PlaceholderBanner}                                from "../../components/banners/PlaceholderBanner/PlaceholderBanner";

/**
 * LessonItem
 */
export interface LessonItem {
    lessonId: string,
    name: string;
    description: string
}

/**
 * LessonTableProps
 */
export interface LessonTableProps {
    loading: boolean
    data: LessonItem[];

    onClick: (lesson: LessonItem) => void
}

/**
 * LessonTable
 * @param props
 * @constructor
 */
export function LessonTable(props: LessonTableProps) {
    if(props.data.length === 0){
        return <PlaceholderBanner
            loading={props.loading}
            title="No lessons available"
            icon="lessons"
            description="Adjust your search or contact a representative if your expecting results."
        />
    }

    const rows = props.data.map((row) => (
        <tr key={row.lessonId}>
            <td>
                <UnstyledButton
                    sx={(theme) => ({
                        display: 'block',
                        width: '100%',
                        padding: theme.spacing.md,
                        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                        '&:hover': {
                            backgroundColor:
                                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
                        },
                    })}

                    onClick={() => props.onClick && props.onClick(row)}
                >
                    <Group>
                        <div>
                            <Text size="sm" weight={500}>
                                {row.name}
                            </Text>
                            <Text size="xs" color="dimmed">
                                {row.description}
                            </Text>
                        </div>
                    </Group>
                </UnstyledButton>
            </td>
        </tr>
    ));

    return (
        <ScrollArea.Autosize maxHeight={500}>
            <Table horizontalSpacing={0} verticalSpacing={0} sx={{ minWidth: 700 }}>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea.Autosize>
    );
}