ALTER TABLE accounts drop COLUMN payment_date;
ALTER TABLE accounts ADD payment_date int NULL;
