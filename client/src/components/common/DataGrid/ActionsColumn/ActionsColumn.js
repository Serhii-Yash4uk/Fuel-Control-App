import { Menu, Portal, Box, Icon } from '@chakra-ui/react';

import { LuPenLine, LuTrash2 } from 'react-icons/lu';

import { CONSTANTS } from './CONSTANTS';

export const ActionsColumn = ({ onEdit, onDelete }) => (
  <Menu.Root>
    <Menu.Trigger asChild>
      <Icon
        borderRadius='full'
        cursor='pointer'
        fill='gray.600'
        _hover={{ bg: 'gray.200' }}
        w='30px'
        h='30px'
        p='4px'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 16 16'>
          <path d='M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0' />
        </svg>
      </Icon>
    </Menu.Trigger>
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item
            value='edit'
            onClick={onEdit}
            cursor='pointer'
            borderRadius='sm'>
            <Icon as={LuPenLine} boxSize={4} />
            <Box flex='1'>{CONSTANTS.Edit}</Box>
          </Menu.Item>
          <Menu.Item
            value='delete'
            onClick={onDelete}
            cursor='pointer'
            borderRadius='sm'>
            <Icon as={LuTrash2} boxSize={4} />
            <Box flex='1'>{CONSTANTS.Delete}</Box>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  </Menu.Root>
);
