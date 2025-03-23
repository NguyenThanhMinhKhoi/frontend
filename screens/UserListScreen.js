import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, RefreshControl, TextInput } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  const addUser = async () => {
    if (!name || !email) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      console.log("Dữ liệu gửi lên API:", { name, email });
  
      const response = await axios.post(API_URL, { name, email }, {
        headers: { "Content-Type": "application/json" }
      });
  
      console.log("Phản hồi API:", response.data);
      setUsers([...users, response.data]);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error.response?.data || error.message);
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể thêm người dùng");
    }
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
      <TextInput 
        placeholder="Nhập tên" 
        value={name} 
        onChangeText={setName} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput 
        placeholder="Nhập email" 
        value={email} 
        onChangeText={setEmail} 
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Thêm người dùng" onPress={addUser} />
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