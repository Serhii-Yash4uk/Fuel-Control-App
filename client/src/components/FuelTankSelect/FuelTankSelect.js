import { Portal, Select } from '@chakra-ui/react';

export const FuelTankSelect = ({
  tanksCollection,
  value,
  handleChange,
  hidePortal = false,
  ...props
}) => (
  <Select.Root
    collection={tanksCollection}
    value={value}
    onValueChange={handleChange}
    disabled={!tanksCollection.items.length}
    {...props}>
    <Select.HiddenSelect />
    <Select.Control>
      <Select.Trigger
        borderColor='transparent'
        rounded='lg'
        pl='2'
        _hover={{
          textDecoration: 'none',
          outline: '2px solid',
          outlineColor: 'teal.400',
          outlineOffset: '2px',
        }}>
        <Select.ValueText
          placeholder='Бочка'
          color='white'
          fontWeight='semibold'
          fontSize={{ base: 'lg', xl: 'md' }}
        />
      </Select.Trigger>
      <Select.IndicatorGroup>
        <Select.Indicator color='white'></Select.Indicator>
      </Select.IndicatorGroup>
    </Select.Control>

    {!hidePortal ? (
      <Portal>
        <Select.Positioner>
          <Select.Content minW='max-content' borderRadius='md'>
            {tanksCollection.items.map((tank) => (
              <Select.Item
                px='4'
                py='2'
                cursor='pointer'
                fontSize='md'
                borderRadius='md'
                item={tank}
                key={tank.value}
                onClick={() => handleChange({ value: tank.value })}>
                {tank.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    ) : (
      <Select.Positioner>
        <Select.Content>
          {tanksCollection.items.map((tank) => (
            <Select.Item
              px='4'
              py='2'
              cursor='pointer'
              fontSize='md'
              borderRadius='md'
              item={tank}
              key={tank.value}
              color='gray.900'
              onClick={() => handleChange({ value: tank.value })}>
              {tank.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    )}
  </Select.Root>
);
