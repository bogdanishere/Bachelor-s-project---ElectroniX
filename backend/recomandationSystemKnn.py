# knn
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import mysql.connector
import warnings

warnings.filterwarnings('ignore')

db_config = {
    'user': 'root',
    'password': 'manager',
    'host': 'localhost',
    'database': 'electronix2',
    'port': '3308',
}

connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()
query = 'SELECT * FROM product'
cursor.execute(query)
data = cursor.fetchall()
realdata = data
data = pd.DataFrame(data, columns=cursor.column_names)
product_id_to_index = pd.Series(data.index, index=data['product_id']).to_dict()

connection.close()




def knn_recomandationSystem(id_produs, n_recommendations=5, df=data):
    product_id_to_index = pd.Series(df.index, index=df['product_id']).to_dict()
    id_produs = product_id_to_index[id_produs]
    def get_top(prefix, column, number_of_values=20, importance = 1):
        all_values = column.str.split(',', expand=True).stack()
        top_values = all_values.value_counts().head(number_of_values).index.tolist()
    
        for value in top_values:
            df[prefix + value] = column.apply(lambda x: importance if value in x else 0)
    


    get_top('cat_', df['categories'], 5, 1)
    get_top('name_', df['name'], 5, 10)
    get_top('brand_', df['brand'], len(df['brand'].unique()), 1000)

    X = df.drop(columns=['name','weight','brand','categories','rating', 'quantity', 'product_id', 'currency',
                          'description', 'prices_availability', 'prices_condition', 'prices_merchant', 'prices_sourceURLs',
                            'dateAdded', 'dateUpdated', 'imageURLs', 'sourceURLs', 'nr_rating'])

    model = NearestNeighbors(n_neighbors=5, algorithm='brute', metric='cosine')
    model.fit(X)


    def find_similar_products(product_index, n_recommendations=5):

        product_features = X.iloc[[product_index]].values.reshape(1, -1)

        distances, indices = model.kneighbors(product_features, n_neighbors=n_recommendations)

        # print('distances:', distances, indices)



        return df.iloc[indices[0][1:]]  


    print(df['name'][id_produs], df['brand'][id_produs])

    return find_similar_products(id_produs, n_recommendations=n_recommendations)



def list_products(productIds):
    print(productIds)
    recommendations = []  
    for product_id in productIds:
        try:
            rec_products_df = knn_recomandationSystem(product_id, 3, data)
            recommended_product_names = rec_products_df['product_id'].tolist()
            recommendations.append({
                "recommendations": recommended_product_names
            })
        except Exception as e:
            print(f"Error processing product ID {product_id}: {e}")
            recommendations.append({
                "productId": product_id,
                "error": "Failed to get recommendations"
            })
    return recommendations


