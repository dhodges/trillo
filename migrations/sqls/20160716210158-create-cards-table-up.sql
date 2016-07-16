
CREATE TABLE cards (
    name character varying(255) NOT NULL,
    archived timestamp NOT NULL,
    id character varying(24) NOT NULL,
    data json NOT NULL
);

ALTER TABLE ONLY cards ADD CONSTRAINT cards_pkey PRIMARY KEY (id);
