import React, { useEffect, useState } from "react";
import { useGetFavouritesMutation } from "../slices/userApiSlice";
import { useSelector } from "react-redux";
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useRemovePerfumeMutation } from "../slices/userApiSlice";
import { toast } from 'react-toastify';

const Favourites = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [getFavourites, { isLoading, data, error }] = useGetFavouritesMutation();
    const [removePerfume] = useRemovePerfumeMutation();
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        const fetchFavourites = async () => {
            if (userInfo) {
                try {
                    const result = await getFavourites({ userId: userInfo._id }).unwrap();
                    setFavourites(result);
                } catch (err) {
                    console.error("Failed to fetch favourites: ", err);
                }
            }
        };

        fetchFavourites();
    }, [userInfo, getFavourites]);

    const handleDelete = async (perfumeName) => {
        try {
            const res = await removePerfume({ perfumeName }).unwrap();
            const updatedFavourites = favourites.filter(item => item !== perfumeName);
            setFavourites(updatedFavourites);
            toast.success(res.message, {
                autoClose: 1000,
            });

        } catch (err) {
            toast.error(err?.data?.message || err.error, {
                autoClose: 1000,
            });
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Your Favourites</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <h4>Error: {error.message}</h4>
            ) : favourites.length === 0 ? (
                <h4>No favourites</h4>
            ) : (
                <div style={styles.favouritesGrid}>
                    {favourites.map((perfume, index) => (
                        <div key={index} style={{ ...styles.card, backgroundColor: getRandomColor() }}>
                            <h2 style={styles.cardTitle}>{perfume}</h2>
                            <IoIosCloseCircleOutline
                                style={{ cursor: 'pointer', marginTop: '10px', fontSize: '24px', color: '#fff' }}
                                onClick={() => handleDelete(perfume)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getRandomColor = () => {
    const colors = ['#FF6F61', '#6B5B95', '#88B04B', '#FF908E', '#92A8D1', '#955251', '#B565A7', '#009B77', '#DD4124', '#D65076'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
    },
    header: {
        fontSize: '3rem',
        marginBottom: '20px',
        color: '#333',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    },
    favouritesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '20px',
    },
    card: {
        backgroundColor: '#FF6F61', // Bright coral color
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        maxWidth: '300px',
        textAlign: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: '2rem',
        marginBottom: '0',
        color: '#fff',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    },
};

export default Favourites;
