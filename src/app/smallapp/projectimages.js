import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function StandardImageList({ imgStyles, listStyles, cols = 3 }) {
    return (
        <ImageList
            sx={{
                width: '100%',
                maxWidth: 1000,
                height: 'auto',
                gap: 16, // Default gap between items
                ...listStyles, // Allow custom styles for the list
            }}
            cols={cols} // Allow dynamic column adjustment
            rowHeight="auto" // Ensure rows adjust dynamically
        >
            {itemData.map((item) => (
                <ImageListItem
                    key={item.img}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 4px 8px rgba(10, 0, 0, 0.2)', // Add shadow for depth
                    }}
                >
                    <img
                        srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                        style={{
                            borderRadius: '4px',
                            width: '100%',
                            objectFit: 'cover',
                            ...imgStyles, // Allow custom styles for images
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

const itemData = [
    {
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Krispy_Kreme_Cannington%2C_April_2022.jpg/330px-Krispy_Kreme_Cannington%2C_April_2022.jpg',
        title: 'Coffee',
    },
    {
        img: 'https://images.squarespace-cdn.com/content/v1/5a563c1cd55b41fd7759755f/1671904710126-A9EX9GGZOA1B8PL1EP6B/Dozen+Classics.JPG?format=1000w',
        title: 'Donut1',
    },
    {
        img: 'https://images.immediate.co.uk/production/volatile/sites/30/2022/05/ring-doughnuts-37fd271.jpg?resize=900%2C471',
        title: 'Donut',
    },
];
