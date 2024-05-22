import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";

 function TableProfilePage() {

    
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableHeadCell>{"Name (Project Title)"}</TableHeadCell>
          <TableHeadCell>Date</TableHeadCell>
          <TableHeadCell>State</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Open</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {'Project 1"'}
            </TableCell>
            <TableCell>08/04/2024</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Open
              </a>
            </TableCell>
          </TableRow>
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              Project 2
            </TableCell>
            <TableCell>10/08/2023</TableCell>
            <TableCell>Finished</TableCell>
            <TableCell>
              <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                Open
              </a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default TableProfilePage;
