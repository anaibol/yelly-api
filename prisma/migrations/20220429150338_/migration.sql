CREATE SEQUENCE public.global_id_seq;

CREATE OR REPLACE FUNCTION public.generate_id()
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
    our_epoch bigint := 1314220021721;
    seq_id bigint;
    now_millis bigint;
    result bigint:= 0;
BEGIN
    SELECT nextval('public.global_id_seq') % 1024 INTO seq_id;

    SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
    result := (now_millis - our_epoch) << 23;
    result := result | (seq_id);
return result;
END;
$function$