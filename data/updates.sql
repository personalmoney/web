ALTER TABLE accounts drop COLUMN payment_date;
ALTER TABLE accounts ADD payment_date int NULL;

/* Function Payee cateogries Start */

CREATE
OR replace function function_get_payee_categories(source_payee_id bigint) RETURNS TABLE (sub_category_id bigint) LANGUAGE plpgsql SECURITY INVOKER AS $$
BEGIN
RETURN QUERY 
select distinct t.sub_category_id from transactions as t where t.payee_id =  source_payee_id;
END
$$;

/* Function Payee cateogries End */