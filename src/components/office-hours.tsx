'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export type OfficeHours = {
    id: number,
    location: string,
    start_time: string,
    end_time: string,
    instructors: string[],
}

export const columns: ColumnDef<OfficeHours>[] = [
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        accessorKey: 'start_time',
        header: 'Start Time',
    },
    {
        accessorKey: 'end_time',
        header: 'End Time',
    },
    {
        accessorKey: 'instructors',
        header: 'Instructors',
    }
]

interface OfficeHoursTableProps<Tdata, Tvalue>{
    columns: ColumnDef<Tdata, Tvalue>[],
    data: Tdata[],
}

export function OfficeHoursTable<Tdata,Tvalue>({columns, data}: OfficeHoursTableProps<Tdata, Tvalue>){
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })
    return (
        <div>
            <Table>
                <TableHeader className='border-none'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow className='hover:bg-transparent' key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return(
                                    <TableHead className='text-md font-semibold' key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header,header.getContext())}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className='rounded-xl border'>
                    {table.getRowModel().rows?.length ?
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            className='h-10'
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        </TableRow>
                        ))
                        :(
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </div>
    )
}