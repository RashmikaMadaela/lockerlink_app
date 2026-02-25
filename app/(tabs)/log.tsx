import LogCard from "@/components/logcard";
import { subscribeToLogs } from "@/firebase/db";
import { LogEntry } from "@/types";
import { formatTimestamp } from "@/utils/lockerUtils";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import "../../global.css";

export default function History() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-sm font-semibold text-gray-500 mb-3 ml-1">
            RECENT ACTIVITY
          </Text>

          {loading && (
            <ActivityIndicator size="small" color="#3b82f6" className="mt-8" />
          )}

          {!loading && logs.length === 0 && (
            <Text className="text-center text-gray-400 mt-8">
              No activity yet.
            </Text>
          )}

          {logs.map((log) => (
            <LogCard
              key={log.id}
              action={log.action}
              timestamp={formatTimestamp(log.timestamp)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
