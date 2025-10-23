import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Searchbar,
  Card,
  Text,
  Chip,
  ActivityIndicator,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function HomeScreen({ navigation }) {
  // Demo products
  const [products, setProducts] = useState([
    {
      _id: '1',
      name: 'Red T-shirt',
      price: 19.99,
      category: 'Clothing',
      stock: 10,
      rating: 4.2,
      reviews: [],
      description: 'Comfortable cotton t-shirt',
      image_url: 'https://via.placeholder.com/200x200.png?text=Red+T-shirt'
    },
    {
      _id: '2',
      name: 'Wireless Headphones',
      price: 59.99,
      category: 'Electronics',
      stock: 5,
      rating: 4.7,
      reviews: [],
      description: 'High-quality wireless headphones',
      image_url: 'https://via.placeholder.com/200x200.png?text=Headphones'
    }
  ]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food'];

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) {
      showSnackbar('Added to cart successfully!');
    } else {
      showSnackbar(result.message || 'Failed to add to cart');
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ visible: true, message });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // simulate refresh
  };

  const renderProduct = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 50} duration={400} style={styles.productCardWrapper}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      >
        <Card style={styles.productCard} elevation={2}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            {item.stock < 5 && item.stock > 0 && (
              <View style={styles.lowStockBadge}>
                <Text style={styles.lowStockText}>Only {item.stock} left</Text>
              </View>
            )}
            {item.stock === 0 && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockBadgeText}>Out of Stock</Text>
              </View>
            )}
          </View>
          
          <Card.Content style={styles.cardContent}>
            <Text style={styles.categoryTag}>{item.category}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {item.rating ? item.rating.toFixed(1) : '0.0'}</Text>
              <Text style={styles.reviewCount}>({item.reviews?.length || 0})</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              {item.stock > 0 && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item._id);
                  }}
                  style={styles.addButton}
                >
                  <IconButton
                    icon="cart-plus"
                    iconColor="#fff"
                    size={20}
                    style={styles.cartIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Find the perfect products for you</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#D32F2F"
          elevation={1}
        />
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryListContent}
        >
          {categories.map((item) => (
            <Chip
              key={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
              ]}
              textStyle={[
                styles.categoryChipText,
                selectedCategory === item && styles.categoryChipTextSelected
              ]}
              mode={selectedCategory === item ? 'flat' : 'outlined'}
            >
              {item}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Products Section */}
      <View style={styles.productsSection}>
        <View style={styles.productsSectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
          <Text style={styles.productCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </Text>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#D32F2F']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Animatable.Text animation="fadeIn" style={styles.emptyIcon}>
                🔍
              </Animatable.Text>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={2500}
        action={{
          label: 'View',
          onPress: () => navigation.navigate('Cart'),
        }}
        style={styles.snackbar}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

// --- Styles (same as your original) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#D32F2F', paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4, shadowColor: '#D32F2F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  headerContent: { marginTop: 8 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#e1d5ff' },
  searchContainer: { paddingHorizontal: 16, marginTop: -20, marginBottom: 16 },
  searchBar: { borderRadius: 12, elevation: 3, backgroundColor: '#fff' },
  categoriesSection: { marginBottom: 16 },
  categoryListContent: { paddingHorizontal: 16, paddingVertical: 8 },
  categoryChip: { marginRight: 10, backgroundColor: '#fff', borderColor: '#e0e0e0', borderRadius: 20, height: 38 },
  categoryChipSelected: { backgroundColor: '#D32F2F', borderColor: '#D32F2F' },
  categoryChipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  categoryChipTextSelected: { color: '#fff', fontWeight: '600' },
  productsSection: { flex: 1 },
  productsSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  productCount: { fontSize: 13, color: '#999', fontWeight: '500' },
  listContainer: { paddingHorizontal: 12, paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  productCardWrapper: { width: CARD_WIDTH },
  productCard: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginHorizontal: 4 },
  imageContainer: { position: 'relative', width: '100%', height: 160, backgroundColor: '#f5f5f5' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  lowStockBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 152, 0, 0.95)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  lowStockText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  outOfStockBadge: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  outOfStockBadgeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  cardContent: { padding: 12 },
  categoryTag: { fontSize: 10, color: '#D32F2F', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, height: 38, lineHeight: 19 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rating: { fontSize: 12, color: '#666', marginRight: 4 },
  reviewCount: { fontSize: 11, color: '#999' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F' },
  addButton: { backgroundColor: '#D32F2F', borderRadius: 20, width: 36, height: 36, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  cartIcon: { margin: 0, padding: 0 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
  snackbar: { backgroundColor: '#323232' },
});
