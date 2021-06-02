 <template>
   <div class="q-pa-md">
     <div class="q-gutter-y-md ">
         <q-tabs
             v-model="tab"
             dense
             class="text-grey"
             active-color="primary"
             indicator-color="primary"
             align="justify"
             narrow-indicator
         >
           <q-tab name="online" label="Online Payment" />
           <q-tab name="inPerson" label="In-Person" />
           <q-tab name="subscriptions" label="Subscriptions" />
           <q-tab name="invoicing" label="Invoicing" />
         </q-tabs>

         <q-separator />

         <q-tab-panels v-model="tab" animated>
           <q-tab-panel name="online">
             <div class="text-h6">Online Payment</div>
             <div class="">
               <q-card style="width:300px" class=" bg-grey-3">
                 <q-card-section>
                   <q-img contain src="https://mir-s3-cdn-cf.behance.net/project_modules/1400/1bfdea18816493.562cfcdb8778e.jpg"></q-img>
                 </q-card-section>
                 <q-card-actions>
                   <q-btn  class="full-width" color="primary" label="Checkout T-shirt" @click="checkoutBtn"/>
                 </q-card-actions>
               </q-card>
             </div>
             <br>
             <a href="https://stripe.com/docs/checkout/integration-builder">https://stripe.com/docs/checkout/integration-builder</a>
           </q-tab-panel>

           <q-tab-panel name="inPerson">
             <div class="text-h6">In-Person</div>
             In-Person
           </q-tab-panel>

           <q-tab-panel name="subscriptions">
             <div class="text-h6">Subscriptions</div>
             Subscriptions
           </q-tab-panel>

           <q-tab-panel name="invoicing">
             <div class="text-h6">Invoicing</div>
             Invoicing
           </q-tab-panel>
         </q-tab-panels>
     </div>
   </div>
</template>
<script>
// import { loadStripe } from '@stripe/stripe-js';
// import firebase from '../firebase/connect.js'
import functions from '../firebase/functions'
import { stripePublicKey } from '../config/stripe'
import { ref, onMounted } from "vue";

  export default {
    components: {},
    setup() {
      const createStripeCheckout = functions.httpsCallable('createStripeCheckout')
      const stripe = Stripe(stripePublicKey)
      const checkoutBtn = () => {
        createStripeCheckout()
         .then(response => {
           const sessionId = response.data.id;
           stripe.redirectToCheckout({sessionId: sessionId})
         })
      };
      onMounted(() => console.log('1234'));
      return {
        checkoutBtn,
        tab: ref('online')
      };
    },
  };
</script>
<style lang="sass" scoped>
</style>
