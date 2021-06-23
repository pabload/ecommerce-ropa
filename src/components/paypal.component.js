import React, {useEffect, useRef } from 'react'
export const Paypalcomponent = ({productsTotal,setloading,handleClose}) => {
    const paypal = useRef(null);
    useEffect(() => {
        window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "purchase from cuidado con el gato",
                  amount: {
                    currency_code: "MXN",
                    value: productsTotal,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            handleClose();
            setloading(true);
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypal.current);
    }, []);
    return <div ref={ paypal }></div>
}
