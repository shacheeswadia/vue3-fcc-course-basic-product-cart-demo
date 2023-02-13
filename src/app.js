let app = Vue.createApp(
    {
        data: function () {
            return {
                showSideBar: false,
                inventory: [], // all the times available from the data - only the quantity is updated when it is entered by the user
                cart: {} // items in the cart 
            }
        },
        computed: {
            totalQuantity() {
                return Object.values(this.cart).reduce((acc, curr) => {
                    return acc + curr;
                }, 0)
            }
        },
        methods: {
            addToCart(name, index) {
                // receive the number and name of item
                if (!this.cart[name]) {
                    this.cart[name] = 0;
                }
                this.cart[name] += this.inventory[index].quantity;
                this.inventory[index].quantity = 0;
                console.log("Cart items", this.cart, this.inventory)
            },
            toggleSidebar() {
                this.showSideBar = !this.showSideBar;
            }
            // removeItem(name) {
            //     delete this.cart[name];
            // }
        },
        async mounted() {
            const res = await fetch('./food.json');
            const data = await res.json();
            this.inventory = data;
        }
    }
)

// make the cart as a component
app.component('sidebar', {
    props: ['toggle', 'cart', 'inventory'],
    computed: {

    },
    methods: {
        getPrice: function (name) {
            const product = this.inventory.find((p) => {
                return p.name === name;
            });
            return product.price.USD;
        },
        calculateTotal: function () {
            const total = Object.entries(this.cart).reduce((acc, curr, index) => { // curr is an array with [key, value] pair
                return acc + (curr[1] * this.getPrice(curr[0]))
            }, 0);
            return total.toFixed(2);
        },
        removeItem(name) {
            delete this.cart[name];
        }
    },
    template: `
      <aside class="cart-container">
        <div class="cart">
          <h1 class="cart-title spread">
            <span>
              Cart
              <i class="icofont-cart-alt icofont-1x"></i>
            </span>
            <button @click="toggle" class="cart-close">&times;</button>
          </h1>

          <div class="cart-body">
            <table class="cart-table">
              <thead>

                <tr>
                  <th><span class="sr-only">Product Image</span></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(quantity, key, i) in cart" :key="i">
                  <td><i class="icofont-carrot icofont-3x"></i></td>
                  <td>{{ key }}</td>
                  <td>\${{ getPrice(key) }}</td>
                  <td class="center">{{ quantity }}</td>
                  <td>\${{ (quantity * getPrice(key)).toFixed(2) }}</td>
                  <td class="center">
                    <button @click="removeItem(key)" class="btn btn-light cart-remove">
                      &times;
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
            <div class="spread">
              <span><strong>Total:</strong> \${{ calculateTotal() }}</span>
              <button class="btn btn-light">Checkout</button>
            </div>
          </div>
        </div>
      </aside>
    `
})


app.mount("#app");