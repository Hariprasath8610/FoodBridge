import threading
from PySide6.QtCore import QObject,Signal
from PySide6.QtGui import QImage,QPixmap
from PySide6.QtWidgets import QApplication,QWidget,QVBoxLayout,QHBoxLayout,QLineEdit,QPushButton,QLabel,QPlainTextEdit,QMessageBox
from main import Controller
class Bridge(QObject):
    event=Signal(str); screen=Signal(object); confirm=Signal(str)
class Window(QWidget):
    def __init__(self):
        super().__init__();self.setWindowTitle("AI Computer Controller");self.resize(800,700);self.bridge=Bridge();self.controller=None
        self.command=QLineEdit();self.command.setPlaceholderText("Describe the task, e.g. Open Notepad")
        self.preview=QLabel("CURRENT SCREEN");self.preview.setMinimumHeight(380);self.preview.setScaledContents(False)
        self.status=QLabel("STATUS: STOPPED");self.log=QPlainTextEdit();self.log.setReadOnly(True);go=QPushButton("EXECUTE");stop=QPushButton("STOP")
        row=QHBoxLayout();row.addWidget(go);row.addWidget(stop);layout=QVBoxLayout(self);layout.addWidget(QLabel("AI COMPUTER CONTROLLER\nCommand:"));layout.addWidget(self.command);layout.addLayout(row);layout.addWidget(self.preview);layout.addWidget(self.status);layout.addWidget(QLabel("ACTION LOG"));layout.addWidget(self.log)
        go.clicked.connect(self.start);stop.clicked.connect(lambda:self.controller and self.controller.stop());self.bridge.event.connect(self.show_event);self.bridge.screen.connect(self.show_screen);self.bridge.confirm.connect(self.confirm)
    def start(self):
        if not self.command.text().strip():return
        self.controller=Controller(self.bridge.event.emit,self.bridge.screen.emit,lambda reason:self._ask(reason));threading.Thread(target=self.controller.run_task,args=(self.command.text(),),daemon=True).start()
    def _ask(self,reason):
        result=[];done=threading.Event();self._pending=(result,done);self.bridge.confirm.emit(reason);done.wait();return result[0]
    def confirm(self,reason):
        answer=QMessageBox.question(self,"Confirmation required",reason,QMessageBox.Yes|QMessageBox.No)==QMessageBox.Yes
        if hasattr(self,"_pending"):self._pending[0].append(answer);self._pending[1].set()
    def show_event(self,text):self.status.setText("STATUS: "+text);self.log.appendPlainText(text)
    def show_screen(self,screen):
        img=screen.image.convert("RGB");q=QImage(img.tobytes(),img.width,img.height,img.width*3,QImage.Format_RGB888).copy();self.preview.setPixmap(QPixmap.fromImage(q).scaled(self.preview.size(),aspectMode=1))
def run():
    app=QApplication([]);w=Window();w.show();app.exec()
