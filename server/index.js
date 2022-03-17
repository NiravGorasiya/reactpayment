require('dotenv').config()
const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);

app.post("/payment", cors(), async (req, res) => {
	let { amount, id } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "Spatula company",
			payment_method: id,
			confirm: true,
			shipping: {
				name: 'Jenny Rosen',
				address: {
					line1: '510 Townsend St',
					postal_code: '98140',
					city: 'San Francisco',
					state: 'CA',
					country: 'US',
				},
			},
		})
		console.log("Payment", payment)
        if(payment.status == "succeeded")
        {
            res.json({
                message: "Payment successful",
                success: true
            })
        }else{
            res.json({
                message: "Payment failed",
                success: false
            })
        }
		
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
