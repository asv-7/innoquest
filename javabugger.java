import com.sun.jdi.*;
import com.sun.jdi.connect.*;

import java.util.*;

public class MiniJavaDebugger {

    public static void main(String[] args) throws Exception {
        VirtualMachineManager vmm =
                Bootstrap.virtualMachineManager();

        LaunchingConnector connector =
                vmm.defaultConnector();

        Map<String, Connector.Argument> env =
                connector.defaultArguments();

        env.get("main").setValue("TestProgram");

        VirtualMachine vm = connector.launch(env);
        System.out.println("Debugger attached");

        EventQueue queue = vm.eventQueue();

        while (true) {
            EventSet events = queue.remove();
            for (Event event : events) {
                if (event instanceof VMStartEvent) {
                    System.out.println("VM Started");
                }
                if (event instanceof VMDisconnectEvent) {
                    System.out.println("VM Disconnected");
                    return;
                }
            }
            events.resume();
        }
    }
}