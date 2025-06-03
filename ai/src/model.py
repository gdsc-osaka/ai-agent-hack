class Models:
    def __init__(self) -> None:
        self.base_path = "./models/"

    def pose_predictor_five_point_model_location(self):
        return str(self.base_path + "pose_predictor.dat")

    def dlib_resnet_model_location(self):
        return str(self.base_path + "dlib_face_recognition_resnet_model_v1.dat")

    def cnn_face_detector_model_location(self):
        return str(self.base_path + "cnn_face_detecter.dat")

    def JAPANESE_FACE_V1_model_location(self):
        return str(self.base_path + "JAPANESE_FACE_V1.onnx")
