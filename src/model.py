import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def create_model():
    model = keras.Sequential([
        layers.Input(shape=(256, 256, 3)),
        layers.Conv2D(32, kernel_size=(3, 3), activation='relu'),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Conv2D(64, kernel_size=(3, 3), activation='relu'),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Conv2D(128, kernel_size=(3, 3), activation='relu'),
        layers.MaxPooling2D(pool_size=(2, 2)),
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.Dense(3, activation='sigmoid')  # Assuming 3 output channels for RGB
    ])
    return model

def compile_and_save_model(model, filepath='model.h5'):
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    model.save(filepath)
    print(f'Model saved to {filepath}')

if __name__ == "__main__":
    model = create_model()
    compile_and_save_model(model)