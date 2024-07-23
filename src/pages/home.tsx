import useFetch from "@/hooks/use-fetch";

type TProdcut = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}[];

function HomePage() {
  const { data, error, isLoading, refetch } = useFetch<TProdcut>(
    "products",
    () => fetch("https://fakestoreapi.com/products").then((res) => res.json())
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (data) {
    return (
      <>
        <button onClick={() => refetch()}>refetch</button>
        {data.map((product) => (
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.price}</p>
          </div>
        ))}
      </>
    );
  }
}

export default HomePage;
