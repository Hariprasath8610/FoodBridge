from main import Controller
def test_stop_sets_event():
    controller=Controller();controller.stop();assert controller.stop_event.is_set()
