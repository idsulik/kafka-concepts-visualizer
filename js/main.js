let messageCount = 0;
let consumerCount = 1;
const partitionCount = 3;

function addMessage() {
    messageCount++;
    const partition = messageCount % partitionCount;
    const message = document.createElement('span');
    message.className = 'message';
    message.textContent = `Msg-${messageCount}`;

    const partitionEl = document.getElementById(`partition${partition}`);
    partitionEl.appendChild(message);

    // Animate message delivery to consumer
    setTimeout(() => {
        const consumerIndex = partition % consumerCount;
        const consumer = document.getElementById(`consumer${consumerIndex}`);

        const messageCopy = message.cloneNode(true);
        messageCopy.className = 'message moving';
        document.body.appendChild(messageCopy);

        const messageRect = message.getBoundingClientRect();
        const consumerRect = consumer.getBoundingClientRect();

        messageCopy.style.position = 'fixed';
        messageCopy.style.left = `${messageRect.left}px`;
        messageCopy.style.top = `${messageRect.top}px`;

        setTimeout(() => {
            messageCopy.style.transform = `translate(
            ${consumerRect.left - messageRect.left}px,
            ${consumerRect.top - messageRect.top}px
          )`;

            setTimeout(() => {
                messageCopy.remove();
                const finalMessage = messageCopy.cloneNode(true);
                finalMessage.className = 'message';
                consumer.appendChild(finalMessage);
            }, 500);
        }, 50);
    }, 1000);
}

function addConsumer() {
    if (consumerCount >= partitionCount) {
        alert('Cannot add more consumers than partitions!');
        return;
    }

    const consumer = document.createElement('div');
    consumer.className = 'consumer';
    consumer.id = `consumer${consumerCount}`;
    consumer.innerHTML = `<strong>Consumer ${consumerCount + 1}</strong>`;
    document.getElementById('consumers').appendChild(consumer);
    consumerCount++;

    updateExplanation();
}

function removeConsumer() {
    if (consumerCount <= 1) {
        alert('Must have at least one consumer!');
        return;
    }

    const consumer = document.getElementById(`consumer${consumerCount - 1}`);
    consumer.remove();
    consumerCount--;

    updateExplanation();
}

function updateExplanation() {
    const explanation = document.getElementById('explanation');
    explanation.innerHTML = `
        ⚡ Currently ${consumerCount} consumer${consumerCount > 1 ? 's' : ''} processing messages from ${partitionCount} partitions.<br>
        👥 Each consumer handles ${Math.ceil(partitionCount / consumerCount)} partition${Math.ceil(partitionCount / consumerCount) > 1 ? 's' : ''}.<br>
        🔄 Messages are being distributed automatically.<br>
        💡 Try adding more consumers to see how the workload gets redistributed!
      `;
}

updateExplanation();