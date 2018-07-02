import pandas as pd
import numpy as np

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

FILTER_DELAY = True

def save_pca(df):
    x = df.values
    x = StandardScaler().fit_transform(x)

    #pd.DataFrame(data = x, columns = features).head()
    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(x)
    
    principalDf = pd.DataFrame(data = principalComponents, 
                                columns = ['principal component 1', 'principal component 2'])
    print(type(principalDf.values[:5]))
    
    principalDf["A"] = df["ARR_DELAY_NEW"]
    principalDf["D"] = df["DEP_DELAY_NEW"]
    
    print(principalDf.head(5))

    with open("FDB/pca_viz.tsv", "w") as f:
        a = principalDf.values
        mat = np.matrix(a)
        print("P1\tP2\tA\tD", file=f)
        for line in mat:
            np.savetxt(f, line, delimiter="\t")
    

data_frame = pd.read_csv("FDB/1k-flights.csv")

features = ["ARR_DELAY_NEW","DEP_DELAY_NEW", "AIR_TIME", "DISTANCE", 
            "CARRIER_DELAY", "NAS_DELAY",
            "LATE_AIRCRAFT_DELAY", "ORIGIN_STATE_ABR"]

df = data_frame.loc[:, features]

df = df.fillna(0.0)

cap_c = df["CARRIER_DELAY"]<100
# cap_w = df["WEATHER_DELAY"]<100
cap_n = df["NAS_DELAY"]<100
cap_l = df["LATE_AIRCRAFT_DELAY"]<200

df = df[(df["ARR_DELAY_NEW"] < 150)
        & (df["DEP_DELAY_NEW"] < 150)
        & (df["DISTANCE"] < 3000)
        & (df["AIR_TIME"] > 0)
        & cap_c & cap_n & cap_l]
        
if FILTER_DELAY:
    df = df[(df["ARR_DELAY_NEW"] != 0) | (df["DEP_DELAY_NEW"] != 0)]

df = df.reset_index()

print(df.head())

with open("FDB/1k-6num-attrs.csv", "w") as f:
    df.to_csv(f, index=False, columns=features)
    
save_pca(df.loc[:, features[:-1]])

