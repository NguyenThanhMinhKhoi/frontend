import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const deleteUser = async (userId) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa người dùng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${userId}`);
            setUsers(users.filter(user => user._id !== userId)); 
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa người dùng");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
      </ListItem.Content>
      <Button title="Xóa" onPress={() => deleteUser(item._id)} color="red" />
    </ListItem>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()} 
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default UserListScreen;
