import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { Pagination, Flex, IconButton, ButtonGroup } from '@chakra-ui/react';

import { CONSTANTS } from './CONSTANTS';

export const DataGridPagination = ({
  tableItems = [],
  page = 1,
  setPage = () => {},
  pageSize = CONSTANTS.Fifteen,
}) => {
  const pageCount = Math.ceil(tableItems.length / pageSize);

  return (
    <Flex justify='center' mt={4} className='no-print'>
      <Pagination.Root
        count={tableItems.length}
        pageSize={pageSize}
        page={page}
        onPageChange={(e) => setPage(e.page)}>
        <ButtonGroup
          variant='ghost'
          wrap='nowrap'
          size={{ base: 'xs', sm: 'md' }}>
          <Pagination.PrevTrigger asChild>
            <IconButton disabled={page === 1}>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton disabled={page >= pageCount}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Flex>
  );
};
