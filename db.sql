--
-- PostgreSQL database dump
--

DROP DATABASE IF EXISTS apollo_technical;
CREATE DATABASE apollo_technical;
\c apollo_technical

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: jak
--

CREATE TABLE public.vehicles (
    vin uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    manufacturer_name character varying(100),
    description character varying(250),
    horse_power integer,
    model_name character varying(100),
    model_year integer,
    purchase_price numeric,
    fuel_type character varying(100)
);


ALTER TABLE public.vehicles OWNER TO jak;

--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: jak
--

COPY public.vehicles (vin, manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type) FROM stdin;
\.


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: jak
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (vin);


--
-- PostgreSQL database dump complete
--

