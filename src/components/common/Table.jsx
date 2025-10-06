import React, { useState, useMemo } from 'react';
import { 
  Table as MantineTable, 
  ScrollArea, 
  Text, 
  Group, 
  ActionIcon, 
  Checkbox,
  Menu,
  Box,
  TextInput,
  Select,
  Badge,
  Pagination,
  Center,
  Stack
} from '@mantine/core';
import {
  MdArrowUpward as IconSortUp,
  MdArrowDownward as IconSortDown,
  MdUnfoldMore as IconSort,
  MdSearch as IconSearch,
  MdFilterList as IconFilter,
  MdMoreVert as IconDots,
  MdEdit as IconEdit,
  MdDelete as IconDelete,
  MdVisibility as IconView
} from 'react-icons/md';

// Enhanced Table component with sorting, filtering, and selection
const Table = ({
  data = [],
  columns = [],
  striped = false,
  highlightOnHover = true,
  withBorder = true,
  withColumnBorders = false,
  stickyHeader = false,
  maxHeight = 500,
  loading = false,
  emptyMessage = 'No data available',
  selectable = false,
  onSelectionChange,
  sortable = false,
  searchable = false,
  pagination = null,
  actions,
  ...props
}) => {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sorting
  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    if (sortBy === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery) {
      result = result.filter(row => {
        return columns.some(col => {
          const value = col.accessor ? row[col.accessor] : '';
          return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }

    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortBy, sortDirection, columns]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;

    const start = (currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, currentPage, pagination]);

  // Handle row selection
  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((_, index) => index));
    }
    
    if (onSelectionChange) {
      onSelectionChange(selectedRows.length === paginatedData.length ? [] : paginatedData);
    }
  };

  const handleSelectRow = (index) => {
    const newSelection = selectedRows.includes(index)
      ? selectedRows.filter(i => i !== index)
      : [...selectedRows, index];
    
    setSelectedRows(newSelection);
    
    if (onSelectionChange) {
      onSelectionChange(newSelection.map(i => paginatedData[i]));
    }
  };

  const renderSortIcon = (columnKey) => {
    if (!sortable) return null;
    
    if (sortBy === columnKey) {
      return sortDirection === 'asc' ? <IconSortUp size={16} /> : <IconSortDown size={16} />;
    }
    return <IconSort size={16} style={{ opacity: 0.3 }} />;
  };

  const TableContent = (
    <MantineTable
      striped={striped}
      highlightOnHover={highlightOnHover}
      withTableBorder={withBorder}
      withColumnBorders={withColumnBorders}
      stickyHeader={stickyHeader}
      {...props}
    >
      <MantineTable.Thead>
        <MantineTable.Tr>
          {selectable && (
            <MantineTable.Th style={{ width: 40 }}>
              <Checkbox
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                onChange={handleSelectAll}
              />
            </MantineTable.Th>
          )}
          {columns.map((column) => (
            <MantineTable.Th
              key={column.accessor}
              style={{ 
                cursor: sortable ? 'pointer' : 'default',
                userSelect: 'none',
                width: column.width
              }}
              onClick={() => handleSort(column.accessor)}
            >
              <Group justify="space-between" wrap="nowrap">
                <Text fw={600}>{column.header}</Text>
                {renderSortIcon(column.accessor)}
              </Group>
            </MantineTable.Th>
          ))}
          {actions && <MantineTable.Th style={{ width: 100 }}>Actions</MantineTable.Th>}
        </MantineTable.Tr>
      </MantineTable.Thead>
      
      <MantineTable.Tbody>
        {loading ? (
          <MantineTable.Tr>
            <MantineTable.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
              <Center h={200}>
                <Text c="dimmed">Loading...</Text>
              </Center>
            </MantineTable.Td>
          </MantineTable.Tr>
        ) : paginatedData.length === 0 ? (
          <MantineTable.Tr>
            <MantineTable.Td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
              <Center h={200}>
                <Text c="dimmed">{emptyMessage}</Text>
              </Center>
            </MantineTable.Td>
          </MantineTable.Tr>
        ) : (
          paginatedData.map((row, rowIndex) => (
            <MantineTable.Tr key={rowIndex}>
              {selectable && (
                <MantineTable.Td>
                  <Checkbox
                    checked={selectedRows.includes(rowIndex)}
                    onChange={() => handleSelectRow(rowIndex)}
                  />
                </MantineTable.Td>
              )}
              {columns.map((column) => (
                <MantineTable.Td key={column.accessor}>
                  {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                </MantineTable.Td>
              ))}
              {actions && (
                <MantineTable.Td>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {actions.view && (
                        <Menu.Item
                          leftSection={<IconView size={16} />}
                          onClick={() => actions.view(row)}
                        >
                          View
                        </Menu.Item>
                      )}
                      {actions.edit && (
                        <Menu.Item
                          leftSection={<IconEdit size={16} />}
                          onClick={() => actions.edit(row)}
                        >
                          Edit
                        </Menu.Item>
                      )}
                      {actions.delete && (
                        <Menu.Item
                          leftSection={<IconDelete size={16} />}
                          color="red"
                          onClick={() => actions.delete(row)}
                        >
                          Delete
                        </Menu.Item>
                      )}
                      {actions.custom && actions.custom.map((action, index) => (
                        <Menu.Item
                          key={index}
                          leftSection={action.icon}
                          color={action.color}
                          onClick={() => action.onClick(row)}
                        >
                          {action.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </MantineTable.Td>
              )}
            </MantineTable.Tr>
          ))
        )}
      </MantineTable.Tbody>
    </MantineTable>
  );

  return (
    <Stack>
      {searchable && (
        <TextInput
          placeholder="Search..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}
      
      {stickyHeader ? (
        <ScrollArea h={maxHeight}>
          {TableContent}
        </ScrollArea>
      ) : (
        TableContent
      )}
      
      {pagination && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Showing {((currentPage - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(currentPage * pagination.pageSize, processedData.length)} of{' '}
            {processedData.length} entries
          </Text>
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={Math.ceil(processedData.length / pagination.pageSize)}
          />
        </Group>
      )}
    </Stack>
  );
};

// DataTable variant with more features
export const DataTable = ({
  data,
  columns,
  title,
  description,
  exportable = false,
  filterable = false,
  ...props
}) => {
  const [filters, setFilters] = useState({});

  const handleExport = () => {
    // Simple CSV export
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row => 
      columns.map(col => row[col.accessor]).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}.csv`;
    a.click();
  };

  return (
    <Stack>
      {(title || description) && (
        <Box>
          {title && <Text size="xl" fw={700}>{title}</Text>}
          {description && <Text size="sm" c="dimmed">{description}</Text>}
        </Box>
      )}
      
      {(exportable || filterable) && (
        <Group justify="flex-end">
          {filterable && (
            <Menu>
              <Menu.Target>
                <ActionIcon variant="light">
                  <IconFilter size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Text size="sm" fw={500} p="xs">Filter options</Text>
                {/* Add filter controls here */}
              </Menu.Dropdown>
            </Menu>
          )}
          {exportable && (
            <ActionIcon variant="light" onClick={handleExport}>
              <IconDownload size={16} />
            </ActionIcon>
          )}
        </Group>
      )}
      
      <Table
        data={data}
        columns={columns}
        searchable
        sortable
        selectable
        pagination={{ pageSize: 10 }}
        {...props}
      />
    </Stack>
  );
};

export default Table;