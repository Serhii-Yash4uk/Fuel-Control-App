import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
      {({ type, title, description, action, closable }) => (
        <Toast.Root width={{ md: 'sm' }}>
          {type === 'loading' ? (
            <Spinner size='sm' color='blue.solid' />
          ) : (
            <Toast.Indicator />
          )}
          <Stack gap='1' flex='1' maxWidth='100%'>
            {title && <Toast.Title>{title}</Toast.Title>}
            {description && (
              <Toast.Description>{description}</Toast.Description>
            )}
          </Stack>
          {action && <Toast.ActionTrigger>{action.label}</Toast.ActionTrigger>}
          {closable && <Toast.CloseTrigger />}
        </Toast.Root>
      )}
    </ChakraToaster>
  </Portal>
);
