import { Input, Text, Flex, Icon } from '@chakra-ui/react';

import { LuCalendarDays } from 'react-icons/lu';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';
import { uk } from 'date-fns/locale';

export const CustomDatePicker = ({
  selected = null,
  onChange = () => {},
  showMonthYearPicker = false,
  isClearable = true,
  placeholderText = '',
  text = '',
  style = {},
  startDate = null,
  endDate = null,
  selectsRange = false,
  dateFormat = 'MMMM yyyy',
  mb = 0,
}) => (
  <Flex align='center' gap={2} style={style} mb={mb} maxW='fit-content'>
    <Icon as={LuCalendarDays} color='gray.700' boxSize={7} />
    {text && (
      <Text
        fontWeight='semibold'
        color='gray.700'
        minW='max-content'
        display={{ base: 'none', sm: 'block' }}>
        {text}
      </Text>
    )}
    <DatePicker
      selected={selected}
      onChange={onChange}
      showMonthYearPicker={showMonthYearPicker}
      dateFormat={dateFormat}
      isClearable={isClearable}
      locale={uk}
      placeholderText={placeholderText}
      startDate={startDate}
      endDate={endDate}
      selectsRange={selectsRange}
      customInput={<Input />}
    />
  </Flex>
);
