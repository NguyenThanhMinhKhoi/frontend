import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import axios from "axios";

export default function UserFormScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/users", { name, email });
      navigation.goBack();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Tên" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Lưu" onPress={handleSubmit} />
    </View>
  );
}
