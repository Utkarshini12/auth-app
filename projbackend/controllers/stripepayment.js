const stripe = require("stripe")(
  "sk_test_51GrBXdKZIEnwnaGb1JsqRNomfFj3p522SjBHRZYuXfYHxjeR2cD3zIc5lzUdFxl5tGel2IMYTAdu2rn4TvmZkiTf00kUWkf4Te"
);
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;
  console.log("PRODUCTS", products);

  let amount = 0;
  products.map((p) => {
    amount = amount + p.price;
  });

  const idempotencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test acc",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(100).json(result))
        .catch((err) => console.log(err));
    });
};
