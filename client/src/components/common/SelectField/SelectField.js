import { Select } from '@chakra-ui/react';

export const SelectField = ({
  isLabelVisible = true,
  label = '',
  value = '',
  collection,
  onChange = () => {},
  size = 'md',
  fullWidth = false,
  placeholder = '',
}) => {
  if (!collection || !Array.isArray(collection.items)) {
    return;
  }

  const selectedItem = collection.items.find((item) => item.label === value);
  const selectedValue = selectedItem ? selectedItem.value : undefined;
  const selectWidth = fullWidth ? '100%' : { base: '150px', md: '100%' };

  return (
    <Select.Root
      w={selectWidth}
      size={size}
      collection={collection}
      defaultValue={selectedValue ? [selectedValue] : []}
      onValueChange={(val) => onChange(val.items[0].label)}>
      <Select.HiddenSelect />
      {isLabelVisible && <Select.Label>{label}</Select.Label>}
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} color='black' />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Select.Positioner>
        <Select.Content minW='max-content'>
          {collection.items.map((option) => (
            <Select.Item
              overflow='visible'
              px='4'
              py='2'
              cursor='pointer'
              fontSize='sm'
              borderRadius='md'
              item={option}
              key={option.value}>
              {option.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
