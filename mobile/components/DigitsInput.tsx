import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const DigitsInput = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={4}
        value={inputValue}
        onChangeText={setInputValue} // 입력 값 업데이트
        placeholder="Enter Code"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    textAlign: "center",
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});

export default DigitsInput;
