import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Icon } from "components/elements/Icon";
import { useDashboard } from "contexts/DashboardContext";
import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { getGetUsersQueryKey, useRemoveUser } from "services/api";
import { queryClient } from "utils/react-query";

export const DeleteIcon = chakra(TrashIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export type DeleteUserModalProps = {
  deleteCallback?: () => void;
};

export const DeleteUserModal: FC<DeleteUserModalProps> = () => {
  const { deletingUser: user, onDeletingUser } = useDashboard();
  const { t } = useTranslation();
  const toast = useToast();
  const onClose = () => {
    onDeletingUser(null);
  };

  const { mutate: deleteUser, isLoading } = useRemoveUser({
    mutation: {
      onSuccess() {
        toast({
          title: t("deleteUser.deleteSuccess", { username: user!.username }),
          status: "success",
          isClosable: true,
          position: "top",
          duration: 3000,
        });
        queryClient.invalidateQueries(getGetUsersQueryKey());
        onClose();
      },
    },
  });

  const onDelete = () => {
    if (user) {
      deleteUser({ username: user.username });
    }
  };
  return (
    <Modal isCentered isOpen={!!user} onClose={onClose} size="sm">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent mx="3">
        <ModalHeader pt={6}>
          <Icon color="red">
            <DeleteIcon />
          </Icon>
        </ModalHeader>
        <ModalCloseButton mt={3} />
        <ModalBody>
          <Text fontWeight="semibold" fontSize="lg">
            {t("deleteUser.title")}
          </Text>
          {user && (
            <Text mt={1} fontSize="sm" _dark={{ color: "gray.400" }} color="gray.600">
              <Trans components={{ b: <b /> }}>{t("deleteUser.prompt", { username: user.username })}</Trans>
            </Text>
          )}
        </ModalBody>
        <ModalFooter display="flex">
          <Button size="sm" onClick={onClose} mr={3} w="full" variant="outline">
            {t("cancel")}
          </Button>
          <Button
            size="sm"
            w="full"
            colorScheme="red"
            onClick={onDelete}
            leftIcon={isLoading ? <Spinner size="xs" /> : undefined}
          >
            {t("delete")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};