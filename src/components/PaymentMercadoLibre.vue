<template>
  <div id="paymentBrick_container"></div>
</template>

<script setup>
import { cart } from '@/cartStatus';
import ApiSaleService from '@/shared/services/ApiSaleService';
import ApiPaymentService from '@/shared/services/ApiPaymentService';
import { onMounted } from 'vue';
import { userData } from '@/autStatus';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();

onMounted(async () => {
  // Inicializa con tu Clave Pública (Public Key)
  const mp = new window.MercadoPago('TEST-d88d5b29-19d9-428b-8698-400e49688246');
  const bricksBuilder = mp.bricks();

  const amount = cart.value.reduce((t, i) => t + (i.precio * i.quantity), 0);

  const renderPaymentBrick = async (bricksBuilder) => {
    const settings = {
      initialization: {
        amount, // Monto total a cobrar
        preferenceId: "<ID_GENERADO_EN_EL_BACKEND>", // Opcional para pagos rápidos
      },
      customization: {
        paymentMethods: {
          creditCard: "all",
          debitCard: "all",
          mercadoPago: "all",
        },
      },
      callbacks: {
        onReady: () => {
          /* Brick cargado con éxito */
        },
        onSubmit: ({ selectedPaymentMethod, formData }) => {
          // 3. ENVIAR DATOS AL BACKEND
          return new Promise(async (resolve, reject) => {
            createPayment(selectedPaymentMethod, formData)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
          });
        },
        onError: (error) => console.error(error),
      },
    };
    window.paymentBrickController = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
  };

  renderPaymentBrick(bricksBuilder);
});

const createPayment = async (selectedPaymentMethod, formData) => {
    try {
        const payment = {
            idPayment: 0,
            nameCard: formData.payment_method_id,
            token: formData.token,
            address: formData.payer.email,
            idPaymentMethod: selectedPaymentMethod === 'credit_card' ? 1 : 2

        }

        var paymentC = await ApiPaymentService.Create(payment);
        if(paymentC.idPayment > 0)
            await createSales(paymentC.idPayment);       
    } catch (error) {
        alert(error.message);
    }
}

const createSales = async (idPayment) => {
    try {
        const sales = cart.value.map(x => ({
            cantidad: x.quantity,
            idPayment: idPayment,
            idProducto: x.idProducto,
            idSale: 0,
            idUsuario: userData.value.idUsuario,
            precioTotal: x.precio * x.quantity,
        }));

      await ApiSaleService.Create(sales);
      Swal.fire(
        'Compra Exitosa',
        'la compra se realizo correctamente',
        'success'
      );
        cart.value = [];
        router.push("/products");
    } catch (error) {
      Swal.fire(
        'Error',
        err.message,
        'error'
      );
    }

}

</script>