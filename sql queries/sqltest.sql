PGDMP     0                    z            postgres    14.4    14.4 :    =           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            >           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            @           1262    13754    postgres    DATABASE     l   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';
    DROP DATABASE postgres;
                postgres    false            A           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3392                        3079    16384 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false            B           0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    2                        3079    16753 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            C           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    3            �            1255    16805    get_employee()    FUNCTION     �  CREATE FUNCTION public.get_employee() RETURNS TABLE(emp_id integer, emp_name character, emp_address character, emp_contact character, emp_dob character, emp_departmentid integer, emp_filepath character, dep_name character)
    LANGUAGE plpgsql
    AS $$
begin
return query
	select e.id,e.name,e.address,e.contact,e.dob,e.departmentid,e.filepath,d.name 
	from public.employees e, public.department d
	where e.departmentid = d.id
	order by e.id asc;
	
end;
$$;
 %   DROP FUNCTION public.get_employee();
       public          postgres    false            �            1255    16557    get_employee(integer)    FUNCTION       CREATE FUNCTION public.get_employee(empid integer) RETURNS TABLE(emp_id integer, emp_name character, emp_address character, emp_contact character, emp_dob character, emp_departmentid integer, dep_name character)
    LANGUAGE plpgsql
    AS $$
begin
return query
	
	select  employees.id, employees.name, employees.address, employees.contact, employees.dob, employees.departmentid, department.name
	from public.employees   
	inner join public.department on employees.departmentid = department.id
	where employees.id =empId;
	
		
end;
$$;
 2   DROP FUNCTION public.get_employee(empid integer);
       public          postgres    false            �            1255    16797 
   get_user()    FUNCTION     z  CREATE FUNCTION public.get_user() RETURNS TABLE(userid integer, username character, password character, email character, userroleid integer, userrole character varying)
    LANGUAGE plpgsql
    AS $$
begin 
return query
	Select u.id, u.username, u.password, u.email, u.userroleid, r.name from "user" u join userrole r on r.userroleid = u.userroleid order by u.id asc;

end;
$$;
 !   DROP FUNCTION public.get_user();
       public          postgres    false            �            1255    24875 :   get_userlogininfo(character, integer, integer, date, date)    FUNCTION     �  CREATE FUNCTION public.get_userlogininfo(search character, pagenumber integer, pagesize integer, datetimefrom date, datetimeto date) RETURNS TABLE(userid integer, username character, logindate date, logoutdate date)
    LANGUAGE plpgsql
    AS $$
	Declare 
		PageOffset INTEGER := 0;
		l_query TEXT;
BEGIN 
PageOffset := ((pagenumber-1)*pagesize);
raise notice 'search: %', search;
raise notice 'pagenumber: %', pagenumber;
raise notice 'pagesize: %', pagesize;
raise notice 'fromdate: %', datetimefrom;
raise notice 'todate: %', datetimeto;
raise notice 'pageoffset: %', PageOffset;
	
	IF search = '' THEN
		l_query := 'SELECT DISTINCT userlogininfo.userid, "user".username, max(userlogininfo.logindatetime) as logindate, max(userlogininfo.logoutdatetime) as logoutdate FROM userlogininfo JOIN "user" 
			ON userlogininfo.userid = "user".id
			GROUP BY userlogininfo.userid, "user".username';
			raise notice 'empty search: %', l_query;
	END IF;
		IF search != '' THEN
			l_query := 'SELECT DISTINCT userlogininfo.userid, "user".username, max(userlogininfo.logindatetime) as logindate, max(userlogininfo.logoutdatetime) as logoutdate FROM userlogininfo JOIN "user" 
				ON userlogininfo.userid = "user".id
				WHERE "user".username ILIKE ''%'|| search ||   
				'%'' GROUP BY userlogininfo.userid, "user".username';
				raise notice 'not empty search: %', l_query;
		END IF;
		IF datetimefrom IS NOT NULL AND datetimeto IS NOT NULL THEN
				l_query := l_query ||' HAVING '|| 'max(userlogininfo.logindatetime) BETWEEN '''|| datetimefrom::DATE ||''' AND '''|| datetimeto::DATE ||''' LIMIT ' || pagesize || ' OFFSET ' || PageOffset ;
				raise notice 'fulldatetime: %', l_query;
		ELSIF datetimeto IS NULL THEN 
			l_query := l_query || ' HAVING '|| ' max(userlogininfo.logindatetime)' > datetimefrom::DATE || ' LIMIT ' || pagesize || ' OFFSET ' || PageOffset ;
			raise notice 'datetimeto null: %', l_query;
		ELSIF datetimefrom IS NULL THEN
			l_query := l_query || ' HAVING '|| ' max(userlogininfo.logindatetime)' < datetimeto::DATE || ' LIMIT '|| pagesize || ' OFFSET ' || PageOffset ;
			raise notice 'datetimefrom null: %', l_query;
		ELSE 
			raise notice 'Please Enter Date';
		END IF;
	RETURN query execute l_query;
END;
$$;
 �   DROP FUNCTION public.get_userlogininfo(search character, pagenumber integer, pagesize integer, datetimefrom date, datetimeto date);
       public          postgres    false            �            1255    16681    setdepartment()    FUNCTION       CREATE FUNCTION public.setdepartment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
	delete from employees where departmentid=old.id;
-- 	update employees set departmentid = (SELECT id from department where name ='empty') where departmentid = old.id;
	return new;
end;
$$;
 &   DROP FUNCTION public.setdepartment();
       public          postgres    false            �            1255    16528    totalemployees()    FUNCTION     �   CREATE FUNCTION public.totalemployees() RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare 
	total integer;
BEGIN 
	select count(*) into total from employees;
	return total;
end;
$$;
 '   DROP FUNCTION public.totalemployees();
       public          postgres    false            �            1259    16421 	   addresses    TABLE     �   CREATE TABLE public.addresses (
    id integer NOT NULL,
    "permAddress" character varying(255),
    "tempAddress" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.addresses;
       public         heap    postgres    false            �            1259    16420    addresses_id_seq    SEQUENCE     �   CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.addresses_id_seq;
       public          postgres    false    215            D           0    0    addresses_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;
          public          postgres    false    214            �            1259    16401 
   demo_table    TABLE     D   CREATE TABLE public.demo_table (
    name character varying(255)
);
    DROP TABLE public.demo_table;
       public         heap    postgres    false            �            1259    16414    demo_tables    TABLE     �   CREATE TABLE public.demo_tables (
    id integer NOT NULL,
    address character varying(255),
    age integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.demo_tables;
       public         heap    postgres    false            �            1259    16413    demo_tables_id_seq    SEQUENCE     �   CREATE SEQUENCE public.demo_tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.demo_tables_id_seq;
       public          postgres    false    213            E           0    0    demo_tables_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.demo_tables_id_seq OWNED BY public.demo_tables.id;
          public          postgres    false    212            �            1259    16489 
   department    TABLE     T   CREATE TABLE public.department (
    id integer NOT NULL,
    name character(50)
);
    DROP TABLE public.department;
       public         heap    postgres    false            �            1259    16641 	   employees    TABLE     �   CREATE TABLE public.employees (
    id integer NOT NULL,
    name character(50),
    address character(50),
    contact character(20),
    dob character(25),
    departmentid integer,
    supervisorid integer,
    filepath character(50)
);
    DROP TABLE public.employees;
       public         heap    postgres    false            �            1259    16519    user    TABLE     �   CREATE TABLE public."user" (
    id integer NOT NULL,
    username character(50),
    password character(255),
    email character(50),
    userroleid integer,
    useravatar character(50)
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    16765    userlogininfo    TABLE       CREATE TABLE public.userlogininfo (
    userlogininfoid integer NOT NULL,
    userid integer NOT NULL,
    jwttoken character varying NOT NULL,
    guid uuid DEFAULT public.uuid_generate_v4(),
    logindatetime date NOT NULL,
    logoutdatetime date,
    userroleid integer
);
 !   DROP TABLE public.userlogininfo;
       public         heap    postgres    false    3            �            1259    16764 !   userlogininfo_userlogininfoid_seq    SEQUENCE     �   CREATE SEQUENCE public.userlogininfo_userlogininfoid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.userlogininfo_userlogininfoid_seq;
       public          postgres    false    220            F           0    0 !   userlogininfo_userlogininfoid_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.userlogininfo_userlogininfoid_seq OWNED BY public.userlogininfo.userlogininfoid;
          public          postgres    false    219            �            1259    16780    userrole    TABLE     g   CREATE TABLE public.userrole (
    userroleid integer NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.userrole;
       public         heap    postgres    false            �            1259    16779    userrole_userroleid_seq    SEQUENCE     �   CREATE SEQUENCE public.userrole_userroleid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.userrole_userroleid_seq;
       public          postgres    false    222            G           0    0    userrole_userroleid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.userrole_userroleid_seq OWNED BY public.userrole.userroleid;
          public          postgres    false    221            �           2604    16424    addresses id    DEFAULT     l   ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);
 ;   ALTER TABLE public.addresses ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            �           2604    16417    demo_tables id    DEFAULT     p   ALTER TABLE ONLY public.demo_tables ALTER COLUMN id SET DEFAULT nextval('public.demo_tables_id_seq'::regclass);
 =   ALTER TABLE public.demo_tables ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    212    213            �           2604    16768    userlogininfo userlogininfoid    DEFAULT     �   ALTER TABLE ONLY public.userlogininfo ALTER COLUMN userlogininfoid SET DEFAULT nextval('public.userlogininfo_userlogininfoid_seq'::regclass);
 L   ALTER TABLE public.userlogininfo ALTER COLUMN userlogininfoid DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    16783    userrole userroleid    DEFAULT     z   ALTER TABLE ONLY public.userrole ALTER COLUMN userroleid SET DEFAULT nextval('public.userrole_userroleid_seq'::regclass);
 B   ALTER TABLE public.userrole ALTER COLUMN userroleid DROP DEFAULT;
       public          postgres    false    221    222    222            3          0    16421 	   addresses 
   TABLE DATA           _   COPY public.addresses (id, "permAddress", "tempAddress", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    215   N       /          0    16401 
   demo_table 
   TABLE DATA           *   COPY public.demo_table (name) FROM stdin;
    public          postgres    false    211   ^N       1          0    16414    demo_tables 
   TABLE DATA           Q   COPY public.demo_tables (id, address, age, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    213   �N       4          0    16489 
   department 
   TABLE DATA           .   COPY public.department (id, name) FROM stdin;
    public          postgres    false    216   �N       6          0    16641 	   employees 
   TABLE DATA           j   COPY public.employees (id, name, address, contact, dob, departmentid, supervisorid, filepath) FROM stdin;
    public          postgres    false    218   ,O       5          0    16519    user 
   TABLE DATA           W   COPY public."user" (id, username, password, email, userroleid, useravatar) FROM stdin;
    public          postgres    false    217   vP       8          0    16765    userlogininfo 
   TABLE DATA           {   COPY public.userlogininfo (userlogininfoid, userid, jwttoken, guid, logindatetime, logoutdatetime, userroleid) FROM stdin;
    public          postgres    false    220   �R       :          0    16780    userrole 
   TABLE DATA           4   COPY public.userrole (userroleid, name) FROM stdin;
    public          postgres    false    222   Y       H           0    0    addresses_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.addresses_id_seq', 1, true);
          public          postgres    false    214            I           0    0    demo_tables_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.demo_tables_id_seq', 1, true);
          public          postgres    false    212            J           0    0 !   userlogininfo_userlogininfoid_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.userlogininfo_userlogininfoid_seq', 101, true);
          public          postgres    false    219            K           0    0    userrole_userroleid_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.userrole_userroleid_seq', 2, true);
          public          postgres    false    221            �           2606    16428    addresses addresses_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.addresses DROP CONSTRAINT addresses_pkey;
       public            postgres    false    215            �           2606    16419    demo_tables demo_tables_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.demo_tables
    ADD CONSTRAINT demo_tables_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.demo_tables DROP CONSTRAINT demo_tables_pkey;
       public            postgres    false    213            �           2606    16493    department department_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.department DROP CONSTRAINT department_pkey;
       public            postgres    false    216            �           2606    16645    employees employeeid 
   CONSTRAINT     _   ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employeeid PRIMARY KEY (id) INCLUDE (id);
 >   ALTER TABLE ONLY public.employees DROP CONSTRAINT employeeid;
       public            postgres    false    218            �           2606    16523    user user_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    217            �           2606    16773     userlogininfo userlogininfo_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.userlogininfo
    ADD CONSTRAINT userlogininfo_pkey PRIMARY KEY (userlogininfoid);
 J   ALTER TABLE ONLY public.userlogininfo DROP CONSTRAINT userlogininfo_pkey;
       public            postgres    false    220            �           2606    16787    userrole userrole_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_pkey PRIMARY KEY (userroleid);
 @   ALTER TABLE ONLY public.userrole DROP CONSTRAINT userrole_pkey;
       public            postgres    false    222            �           2620    16682    department setdepartment    TRIGGER     v   CREATE TRIGGER setdepartment BEFORE DELETE ON public.department FOR EACH ROW EXECUTE FUNCTION public.setdepartment();
 1   DROP TRIGGER setdepartment ON public.department;
       public          postgres    false    224    216            �           2606    16646    employees departmentid    FK CONSTRAINT        ALTER TABLE ONLY public.employees
    ADD CONSTRAINT departmentid FOREIGN KEY (departmentid) REFERENCES public.department(id);
 @   ALTER TABLE ONLY public.employees DROP CONSTRAINT departmentid;
       public          postgres    false    218    216    3223            �           2606    16774 #   userlogininfo fk_userlogininfo_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.userlogininfo
    ADD CONSTRAINT fk_userlogininfo_user FOREIGN KEY (userid) REFERENCES public."user"(id);
 M   ALTER TABLE ONLY public.userlogininfo DROP CONSTRAINT fk_userlogininfo_user;
       public          postgres    false    3225    220    217            �           2606    16788    user fk_userrole_user    FK CONSTRAINT     �   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT fk_userrole_user FOREIGN KEY (userroleid) REFERENCES public.userrole(userroleid);
 A   ALTER TABLE ONLY public."user" DROP CONSTRAINT fk_userrole_user;
       public          postgres    false    3231    217    222            3   @   x�3��N,��M�K)��H-I,MI�4202�50�52T04�2��25�32�60�21�+����� {��      /   %   x�����H����*J�N-����sr������� �=      1   :   x�3��N,��M�K)�42�4202�50�52T04�2��25�3�60�21�'����� ���      4   ?   x�3�t��K�KNU prz���Ʉ35����4M����%ř)$9ψ3$���D���qqq ��(!      6   :  x����j�0 �s�}�,�Ĩ��Th��Y�j](��H)D�P����qB��L��A�ݮ=�lug��/��� ��0Ja�� ����nw�tSM�<�Xbi���hLh|��Q�x���b,��� �d�Є��r�cN�gۣ}�c:�X[>_�]�K��	�t_��Nݱ��v���NG7��c(���C<X&�yA[6B9��f�ku��m�:�9^j�7�o��x�o-|�d�<��� p����}�ͨ���)#'!
~�iչ���(�����}�o.�^k�w/S�﹑é�/�}�:a�?ݘ�      5   Y  x����r�P�5>�,\�=�nP��(H���� O��15US�fc��wu�w�5(v��S��ǫy�+�����кkϹѬ�D�,K���\��(j<C�j�Duoi�������d�ȿPBb}��*�!�n���օ�>I�	W�����9�W���FVMc��e�e7hqK?�m��{���'� m�z�~¼�XÚݰ�zb�tM
�|������o��{}R����J�\t�@�����(T�N�@� ��7l�O%�Ci��Mc��ԙ�vn�H�nY)�O'��u��� �4�U��R�]G�-�;��l�f_���G�9"��A�Ã*�8(ӄ����F�I�jfc�%�qh�fW?�%����+k��� ��Wl�p�5���ų(휴v�\$5+3����M^^׶
"�����d�:[b�,�q��dw`sXyr~!?�Q���"vf�	h*���{����]hmKH��~.:��?�o�J6�)����PD>$2��	�e}=�2`���ߪ��יїL��ř�,���xk=��|,Y��8��e8e�U�EK(<j��:�У2#���$�Vq��<��:��h4z�-�      8     x�՘�n*G�����G�/�,^Xf�1�H�Wc��<}j�Er/R�\��`4��������$�Y|k߹k��ۭɹE�u��z
�h�V��Mm��-�F�8���9,F-��N�0+����s��*�~o�|�j���������s��s�o.E�>���Sk�}-6�ע��Ÿ|K��nsV�V׎ؙ����W��.
7G��aٟ���٢f���Zf)�����q&rJ�SH��|Ŕ"��|e$�������˓b��*ׯ�z��[q^�.���j��e{�r�W����`WN���;й���K�0���+���%���p�� �jb	^���e��Kd����k�.��[\�7���5���>��b��t���mwP����xeory�ԯ���!��)�>P�eD��e	Y�=bNI*�ʰ/p�o���%+��:c�W0��f�=�a��V�]k��T2������V�v���Z�q���T"�4cd
�v!9��s\��.O�-���b����e#���9���e�;|�LۄL�כ�IЇ�r8����YR)@����ŉ��i����*���%2 �T�XY��!'�AC$���e&Y`\G�$�qJr����<$�,�ǿ�!FA�`�e�I���jc%��G�*$��`Fxƒ��s���q�pz�,1'�����k��}�^&�"���I�5z��΄Q8X�����b�� 7��D!��i��3�*����7Q�R�92QT?��A��ˢw�kE���J���UB�'�N^�m�����=&�T�����	I#��Ba���0��*��
H�5(�9�2�O�C�oP+Љ[�����x��mu	������}��n���z�W���sor��/1�b��M`ih�;Qİ�Xr���;�-W.��Gs�������4���]֧a��;��*R?o���>�rq%C{��D]�J�;��A-
�K%¨P��.�-�u�<�.\y�.��y�ssd�rE�[�T�֧���nV��W�em}6��2��K����0��B�&�D��*ſ���	.���\�jp��7&��;W�/^!�о����5xݗ3~�ˇf��(MV �0آT��8��Fa��/p��k�Z|����� �ק˺Ы>>��=/���F��'T�G5n:`�m���(\��������ɣ��g�A��b��oѻΓ�G���J]z�h��с.���E�M����;^����r�kx�fNF����� �-bu�3H�av�h��\�`2� �p��7.+\7�������a�0m�uo[����/g����`�<��v�L�W�C8U��&�%C�F��K�*}��*\��?��ĵ��k��k�zo���盟���	$s0}���[nk��B��8<�xw���|^�[��2�1B?7	y8dd%��;l-����s3,+3̙��;'��1dib�8S��6�d�Hb��H����rF�i5�YL�������s��E`�"Xc,�;e�|n"*����!��p  �d��c�i��~\\\�v�W�      :      x�3�tL����2�-N-����� 6��     