import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Divider,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function OrderConfirmationScreen({ route, navigation }) {
  const { order } = route.params;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <ScrollView style={styles.container}>
      <Animatable.View animation="bounceIn" duration={1000} style={styles.iconContainer}>
        <Text style={styles.successIcon}>✅</Text>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={800}>
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>Thank you for your purchase</Text>

        <Card style={styles.card}>
          <Card.Title title="Order Details" />
          <Card.Content>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Order ID:</Text>
              <Text style={styles.value}>{order._id.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Order Date:</Text>
              <Text style={styles.value}>
                {new Date(order.order_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, styles.status]}>{order.status}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Estimated Delivery:</Text>
              <Text style={styles.value}>{estimatedDelivery.toLocaleDateString()}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Items Ordered" />
          <Card.Content>
            {order.items.map((item, index) => (
              <View key={index}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.name} x {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                {index < order.items.length - 1 && <Divider style={styles.itemDivider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Shipping Information" />
          <Card.Content>
            <Text style={styles.address}>{order.shipping_address}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Payment Method" />
          <Card.Content>
            <Text>{order.payment_method}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${order.total_amount.toFixed(2)}</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Profile')}
            style={styles.button}
            icon="history"
          >
            View Order History
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Home')}
            style={styles.button}
          >
            Continue Shopping
          </Button>
        </View>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  successIcon: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#D32F2F',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  status: {
    color: '#4CAF50',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  itemDivider: {
    marginVertical: 5,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  buttonContainer: {
    padding: 15,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 6,
  },
});

