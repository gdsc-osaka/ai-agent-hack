class Models:
    def __init__(self) -> None:
        self.base_path = "./src/model/models/"

    def pose_predictor_five_point_model_location(self):
        return str(self.base_path + "pose_predictor.dat")

    def JAPANESE_FACE_V1_model_location(self):
        return str(self.base_path + "JAPANESE_FACE_V1.onnx")
