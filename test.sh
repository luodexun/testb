#!/bin/bash
# check_remote_mqtt.sh
SERVER="ness.crnewenergy.com.cn"  # 替换为你的服务器
PORT=21883

echo "🔍 检查远程 MQTT 服务器: $SERVER:$PORT"
echo

echo "1. 网络连通性..."
ping -c 2 -W 2 $SERVER >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ 服务器可达"
else
    echo "   ❌ 无法访问服务器"
fi

echo
echo "2. 端口检测..."
nc -z -w 3 $SERVER $PORT 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ 端口 $PORT 开放"
else
    echo "   ❌ 端口 $PORT 未响应"
fi

echo
echo "3. MQTT 协议握手..."
timeout 5 mosquitto_sub -h $SERVER -p $PORT -t "\$SYS/#" -W 1 -C 1 >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ MQTT 服务正常"
else
    echo "   ❌ MQTT 协议连接失败"
fi

echo
echo "4. 完整连接测试..."
echo "exit" | timeout 5 openssl s_client -connect $SERVER:$PORT -quiet 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ SSL/TLS 连接正常"
else
    echo "   ℹ️  SSL/TLS 连接测试跳过（如果需要）"
fi
