import React from "react";
import { Pressable, Text, StyleSheet, Alert } from "react-native";
import { useLanguageStore } from "../state/languageStore";

export default function LanguageSwitcher() {
  const language = useLanguageStore((s) => s.language);
  const toggleLanguage = useLanguageStore((s) => s.toggleLanguage);

  const handlePress = () => {
    toggleLanguage();
    Alert.alert(
      "Language / Langue",
      language === "en"
        ? "French translation coming soon!\nTraduction française à venir!"
        : "English version active!\nVersion anglaise active!",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Text style={styles.text}>
        {language === "en" ? (
          <>
            <Text style={styles.active}>EN</Text>
            <Text>/FR</Text>
          </>
        ) : (
          <>
            <Text>FR/</Text>
            <Text style={styles.active}>EN</Text>
          </>
        )}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E89A3C",
    letterSpacing: 0.5,
  },
  active: {
    textDecorationLine: "underline",
    textDecorationColor: "#E89A3C",
  },
});
