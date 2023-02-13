<template>
  <header class="top-bar spread">
    <nav class="top-bar-nav">
      <router-link to="/" class="top-bar-link">
        <i class="icofont-spoon-and-fork"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/products-view" class="top-bar-link">
        <span>Products</span>
      </router-link>
      <router-link to="past-orders" class="top-bar-link">
        <span>Past Orders</span>
      </router-link>
    </nav>
    <!-- <router-link @click="toggleSidebar" class="top-bar-cart-link">
      <i class="icofont-cart-alt icofont-1x"></i>
      <span>Cart ({{ totalQuantity }})</span>
    </router-link> -->
  </header>

  <router-view :inventory="inventory" />

  <Sidebar
    v-if="showSideBar"
    :toggle="toggleSidebar"
    :cart="cart"
    :inventory="inventory"
  />
</template>

<script>
import { Sidebar } from "@/components/Side-bar.vue";
import food from "../food.json";

export default {
  components: {
    Sidebar,
  },
  data: function () {
    return {
      showSideBar: false,
      inventory: food, // all the times available from the data - only the quantity is updated when it is entered by the user
      cart: {}, // items in the cart
    };
  },

  methods: {
    addToCart(name, index) {
      // receive the number and name of item
      if (!this.cart[name]) {
        this.cart[name] = 0;
      }
      this.cart[name] += this.inventory[index].quantity;
      this.inventory[index].quantity = 0;
      console.log("Cart items", this.cart, this.inventory);
    },
    toggleSidebar() {
      this.showSideBar = !this.showSideBar;
    },
    removeItem(name) {
      delete this.cart[name];
    },
  },
};
</script>
