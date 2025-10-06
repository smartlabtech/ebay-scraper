import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Group,
  Text,
  Badge,
  Button,
  Title,
  Stack,
  Box,
  Avatar,
  TextInput,
  ActionIcon,
  Menu,
  Modal,
  NumberInput,
  Skeleton,
  Pagination
} from '@mantine/core';
import {
  MdSearch,
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdPerson,
  MdEmail,
  MdLocationOn,
  MdVerified,
  MdBlock,
  MdCardGiftcard,
  MdAdminPanelSettings,
  MdContentCopy
} from 'react-icons/md';
import usersService from '../../../services/usersService';
import { useNotifications } from '../../../hooks/useNotifications';

const UsersList = () => {
  const { toast } = useNotifications();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined
      };

      const response = await usersService.getUsers(params);

      if (response.data) {
        setUsers(response.data);
        if (response.pagination) {
          setTotalPages(Math.ceil(response.pagination.total / response.pagination.limit));
          setTotalUsers(response.pagination.total);
        }
      } else {
        setUsers([]);
      }
    } catch (error) {
      toast('Failed to load users', 'error');
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleCopyId = (userId) => {
    navigator.clipboard.writeText(userId);
    toast('User ID copied to clipboard', 'success');
  };

  const handleUpdateCredits = async () => {
    if (!selectedUser) return;

    try {
      await usersService.updateUserCredits(selectedUser._id, creditAmount);
      toast('Credits updated successfully', 'success');
      setShowCreditsModal(false);
      setCreditAmount(0);
      loadUsers();
    } catch (error) {
      toast('Failed to update credits', 'error');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await usersService.updateUserRole(userId, newRole);
      toast(`User role changed to ${newRole}`, 'success');
      loadUsers();
    } catch (error) {
      toast('Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await usersService.deleteUser(userId);
        toast('User deleted successfully', 'success');
        loadUsers();
      } catch (error) {
        toast('Failed to delete user', 'error');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserBadge = (user) => {
    if (user.role === 'admin') {
      return <Badge color="red" variant="filled">Admin</Badge>;
    }
    return <Badge color="blue" variant="light">User</Badge>;
  };

  if (loading) {
    return (
      <Stack gap="lg">
        <Skeleton height={60} />
        <Skeleton height={400} />
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Box>
        <Title order={2} mb={4}>
          Users Management
        </Title>
        <Text c="dimmed" size="sm">
          Manage user accounts, roles, and credits
        </Text>
      </Box>

      {/* Search */}
      <TextInput
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        style={{ maxWidth: 400 }}
        rightSection={
          <ActionIcon onClick={handleSearch} variant="subtle">
            <MdSearch size={18} />
          </ActionIcon>
        }
      />

      {/* Users Table */}
      <Card shadow="sm" radius="md" withBorder p={0}>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Credits</th>
              <th>Location</th>
              <th>Joined</th>
              <th>Status</th>
              <th style={{ width: 80 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <Group gap="xs">
                    <Text
                      size="xs"
                      c="dimmed"
                      style={{
                        fontFamily: 'monospace',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleCopyId(user._id)}
                    >
                      {user._id.substring(0, 8)}...
                    </Text>
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() => handleCopyId(user._id)}
                    >
                      <MdContentCopy size={12} />
                    </ActionIcon>
                  </Group>
                </td>
                <td>
                  <Group gap="sm">
                    <Avatar size="sm" radius="xl" color="violet">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={500}>
                        {user.firstName} {user.lastName}
                      </Text>
                      {user.mobile && (
                        <Text size="xs" c="dimmed">
                          {user.mobile}
                        </Text>
                      )}
                    </Box>
                  </Group>
                </td>
                <td>
                  <Group gap="xs">
                    <Text size="sm">{user.email}</Text>
                    {user.emailVerified && (
                      <MdVerified size={14} color="var(--mantine-color-green-6)" />
                    )}
                  </Group>
                </td>
                <td>{getUserBadge(user)}</td>
                <td>
                  <Group gap="xs">
                    <MdCardGiftcard size={16} color="var(--mantine-color-violet-6)" />
                    <Text fw={600}>{user.credits?.toLocaleString() || 0}</Text>
                  </Group>
                </td>
                <td>
                  {user.location ? (
                    <Group gap="xs">
                      <MdLocationOn size={14} />
                      <Text size="sm">{user.location}</Text>
                    </Group>
                  ) : (
                    <Text size="sm" c="dimmed">-</Text>
                  )}
                </td>
                <td>
                  <Text size="sm">{formatDate(user.createdAt)}</Text>
                </td>
                <td>
                  <Badge
                    color={user.isBlocked ? 'red' : 'green'}
                    variant="light"
                  >
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </Badge>
                </td>
                <td>
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <MdMoreVert size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                      >
                        <MdPerson size={14} style={{ marginRight: 8 }} />
                        View Details
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          setSelectedUser(user);
                          setCreditAmount(user.credits || 0);
                          setShowCreditsModal(true);
                        }}
                      >
                        <MdCardGiftcard size={14} style={{ marginRight: 8 }} />
                        Manage Credits
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => handleToggleRole(user._id, user.role)}
                      >
                        <MdAdminPanelSettings size={14} style={{ marginRight: 8 }} />
                        {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <MdDelete size={14} style={{ marginRight: 8 }} />
                        Delete User
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {users.length === 0 && (
          <Box p="xl" ta="center">
            <Text c="dimmed">No users found</Text>
          </Box>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Showing {users.length} of {totalUsers} users
          </Text>
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}

      {/* User Details Modal */}
      <Modal
        opened={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <Stack>
            <Group>
              <Avatar size="lg" radius="xl" color="violet">
                {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
              </Avatar>
              <Box>
                <Text fw={600}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Text>
                <Text size="sm" c="dimmed">{selectedUser.email}</Text>
              </Box>
            </Group>

            <Box>
              <Text size="xs" c="dimmed" mb={4}>User Information</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Role:</Text>
                  {getUserBadge(selectedUser)}
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Credits:</Text>
                  <Text fw={600}>{selectedUser.credits?.toLocaleString() || 0}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Mobile:</Text>
                  <Text>{selectedUser.mobile || '-'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Location:</Text>
                  <Text>{selectedUser.location || '-'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Preferred Language:</Text>
                  <Text>{selectedUser.preferredLanguage || 'en'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Email Verified:</Text>
                  <Badge color={selectedUser.emailVerified ? 'green' : 'red'} variant="light">
                    {selectedUser.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Joined:</Text>
                  <Text>{formatDate(selectedUser.createdAt)}</Text>
                </Group>
              </Stack>
            </Box>

            {selectedUser.bio && (
              <Box>
                <Text size="xs" c="dimmed" mb={4}>Bio</Text>
                <Text size="sm">{selectedUser.bio}</Text>
              </Box>
            )}
          </Stack>
        )}
      </Modal>

      {/* Credits Modal */}
      <Modal
        opened={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        title="Manage User Credits"
        size="sm"
      >
        {selectedUser && (
          <Stack>
            <Text size="sm">
              Update credits for <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
            </Text>
            <NumberInput
              label="Credits"
              value={creditAmount}
              onChange={setCreditAmount}
              min={0}
              thousandSeparator=","
            />
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setShowCreditsModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCredits}>
                Update Credits
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default UsersList;