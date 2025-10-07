import React, { useState } from 'react';
import { Modal, TextInput, Button, Stack, Group } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { HiTag } from 'react-icons/hi';
import { createKeyword } from '../../store/slices/keywordsSlice';

const AddKeywordModal = ({ opened, onClose }) => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!keyword.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please enter a keyword',
        color: 'red'
      });
      return;
    }

    setLoading(true);

    try {
      await dispatch(createKeyword(keyword.trim())).unwrap();

      notifications.show({
        title: 'Success',
        message: `Keyword "${keyword}" has been added successfully`,
        color: 'green'
      });

      // Reset form and close modal
      setKeyword('');
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error || 'Failed to add keyword',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setKeyword('');
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add New Keyword"
      centered
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Keyword"
            placeholder="Enter keyword (e.g., Binoculars, Cameras)"
            leftSection={<HiTag />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
            disabled={loading}
            autoFocus
          />

          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              leftSection={!loading && <HiTag />}
            >
              Add Keyword
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddKeywordModal;
