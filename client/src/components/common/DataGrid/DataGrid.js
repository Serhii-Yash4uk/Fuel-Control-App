import { useState, useMemo, useEffect } from 'react';
import { Table, EmptyState, VStack, Icon, Flex } from '@chakra-ui/react';
import { LuFuel, LuArrowUp, LuArrowDown } from 'react-icons/lu';

import {
  FormDialog,
  DataGridPagination,
  SelectField,
  DataGridSkeleton,
} from '..';

import { CONSTANTS } from './CONSTANTS';

import './DataGrid.css';

export const DataGrid = ({
  tableItems = [],
  tableHeaderItems = [],
  editForm = {},
  setEditForm = () => {},
  isEditDialogOpen = false,
  setIsEditDialogOpen = () => {},
  handleEditSubmit = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
  pageSize = 15,
  selectionOptions = null,
  isLoading = false,
  disableSorting = false,
}) => {
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedType, setSelectedType] = useState('all');

  const filteredData = useMemo(() => {
    let data = [...tableItems];
    if (selectedType !== 'all' && selectionOptions?.items) {
      const selectedOption = selectionOptions.items.find(
        ({ value }) => value === selectedType
      );
      const selectedLabel = selectedOption?.label;
      if (selectedLabel) {
        data = data.filter(({ azs }) => azs === selectedLabel);
      }
    }
    return data;
  }, [tableItems, selectedType, selectionOptions]);

  const sortedData = useMemo(() => {
    let data = [...filteredData];
    if (!disableSorting && sortKey) {
      data.sort((a, b) => {
        let aValue, bValue;
        if (sortKey === 'dateTime') {
          aValue = Number(a['timestamp']);
          bValue = Number(b['timestamp']);
        } else {
          aValue = a[sortKey];
          bValue = b[sortKey];
          if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }
        }
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [filteredData, sortKey, sortDirection, disableSorting]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const pageCount = Math.max(Math.ceil(sortedData.length / pageSize), 1);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount, setCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, setCurrentPage]);

  const hasEditableFields = useMemo(
    () => tableHeaderItems.some((item) => item.editable),
    [tableHeaderItems]
  );

  const headerKeys = useMemo(
    () => tableHeaderItems.map(({ key }) => key),
    [tableHeaderItems]
  );

  const closeEditDialog = () => setIsEditDialogOpen(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectChange = (val) => {
    const selectedItem = selectionOptions.items.find(
      (item) => item.label === val
    );
    const key = selectedItem ? selectedItem.value : null;
    setSelectedType(key);
    setCurrentPage(1);
  };

  const headerItems = (
    <Table.Row>
      {tableHeaderItems.map(({ key, label, sortable, selectable = false }) => {
        const tableHeaderPadding = selectable ? '8px 12px' : undefined;
        const columnHeaderStyle = {
          padding: tableHeaderPadding,
          ...(key === 'progress' ? { width: '160px' } : {}),
        };

        return (
          <Table.ColumnHeader key={key} style={columnHeaderStyle}>
            {selectable ? (
              <SelectField
                size='sm'
                color='black'
                label={label}
                value={editForm[key]}
                collection={selectionOptions}
                isLabelVisible={false}
                onChange={handleSelectChange}
                placeholder={selectionOptions?.items?.[0]?.label || ''}
              />
            ) : (
              <Flex align='center' gap={2}>
                {label}
                {sortable && (
                  <Icon
                    as={sortDirection === 'asc' ? LuArrowUp : LuArrowDown}
                    className='no-print'
                    borderRadius='full'
                    p='4px'
                    boxSize='6'
                    cursor='pointer'
                    _hover={{ bg: 'gray.200' }}
                    onClick={() => handleSort(key)}
                  />
                )}
              </Flex>
            )}
          </Table.ColumnHeader>
        );
      })}
    </Table.Row>
  );

  const bodyItems = paginatedData.map((r) => (
    <Table.Row key={r.id}>
      {headerKeys.map((key) => {
        let value = r[key] || '—';
        const isPriceInvalid =
          key === 'price' && (!value || value === Number(0) || value === '—');
        const isCentered = key === 'actions' || key === 'paid';
        const cellBg = isPriceInvalid && 'gray.200';
        const cellAlign = isCentered && 'center';
        const cellPadding = isCentered && '4px';

        return (
          <Table.Cell
            key={key}
            bg={cellBg}
            textAlign={cellAlign}
            style={{ padding: cellPadding }}
          >
            {value}
          </Table.Cell>
        );
      })}
    </Table.Row>
  ));

  const TableFooter = sortedData.length === 0 && (
    <Table.Row>
      <Table.Cell colSpan={tableHeaderItems.length}>
        <EmptyState.Root size='sm'>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <Icon as={LuFuel} boxSize={16} />
            </EmptyState.Indicator>
            <VStack textAlign='center'>
              <EmptyState.Title>{CONSTANTS.NoData}</EmptyState.Title>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <>
      <Table.ScrollArea
        maxW='container.xl'
        scrollBehavior='smooth'
        overflowY='hidden'>
        {isLoading && <DataGridSkeleton />}

        {!isLoading && (
          <Table.Root
            variant='outline'
            showColumnBorder
            interactive
            size={{ base: 'sm', sm: 'md' }}
            borderWidth='1px'>
            <Table.Header>{headerItems}</Table.Header>
            <Table.Body>{bodyItems}</Table.Body>
            <Table.Footer>{TableFooter}</Table.Footer>
          </Table.Root>
        )}
      </Table.ScrollArea>

      {sortedData.length > pageSize && !isLoading && (
        <DataGridPagination
          tableItems={sortedData}
          page={currentPage}
          setPage={setCurrentPage}
          pageSize={pageSize}
        />
      )}

      {hasEditableFields && (
        <FormDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          form={editForm}
          setForm={setEditForm}
          handleChange={handleEditChange}
          closeDialog={closeEditDialog}
          handleSubmit={handleEditSubmit}
          headerItems={tableHeaderItems.filter(({ editable }) => editable)}
          selectionOptions={selectionOptions}
        />
      )}
    </>
  );
};
